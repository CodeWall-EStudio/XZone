
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var url = require('url');
var EventProxy = require('eventproxy');

var config = require('../config');
var U = require('../util');
var mUser = require('../models/user');

exports.getUserInfo = function(skey, callback){

    var data = querystring.stringify({
        encodeKey: skey
    });

    U.request({
        url: config.CAS_USER_INFO_CGI,
        method: 'POST',
        data: data,
        headers: {  
            "Content-Type": 'application/x-www-form-urlencoded',  
            "Content-Length": data.length  
        }

    }, function(err, data){
        if(err){
            callback(err);
        }else{
            try{
                callback(null, JSON.parse(data));
            }catch(e){
                console.error('getUserInfo Error', data);
                callback('getUserInfo JSON parse error: ' + e.message);
            }
        }
    });
}

exports.getOrgTree = function(skey,loginName,callback){
    var data = querystring.stringify({
        key : skey,
        loginName : loginName
    });

    U.request({
        url: config.CAS_ORG_TREE_CGI,
        method: 'POST',
        data: data,
        headers: {  
            "Content-Type": 'application/x-www-form-urlencoded',  
            "Content-Length": data.length  
        }

    }, function(err, data){
        if(err){
            callback(err);
        }else{
            console.log(data);
            try{
                callback(null, JSON.parse(data));
            }catch(e){
                console.error('getUserInfo Error', data);
                callback('getUserInfo JSON parse error: ' + e.message);
            }
        }
    });    
}

exports.getUserInfoFromQQ = function(accessToken, callback){
    var ep = new EventProxy();
    ep.fail(callback);

    var url = config.QQ_CONNECT_SITE + config.QQ_CONNECT_OPENID_PATH;
    url += '?' + querystring.stringify({
        access_token: accessToken
    });
    U.request({
        url: url,
        method: 'GET'
    }, ep.done('getOpenIDCb'));

    ep.on('getOpenIDCb', function(data){

        data = U.parseCallbackData(data);
        var openid = data && data.openid;
        if(!openid){
            ep.emit('error', 'get openid error');
        }else{
            ep.emit('getOpenID', openid);
            var url = config.QQ_CONNECT_SITE + config.QQ_CONNECT_USERINFO_PATH;
            url += '?' + querystring.stringify({
                access_token: accessToken,
                oauth_consumer_key: config.QQ_CONNECT_APPID,
                openid: openid
            });

            U.request({
                url: url,
                method: 'GET'
            }, ep.done('getUserInfoCb'));
        }
    });

    ep.all('getOpenID', 'getUserInfoCb', function(openid, data){
        try{
            data = JSON.parse(data);
            // console.log('>>>getQQUserInfo: ', openid, data);
        }catch(e){
            callback('getQQUserInfo JSON parse error: ' + e.message);
            return;
        }
        if(data.ret === 0){
            data.openid = openid;
            callback(null, data);
        }else{
            ep.emit('error', data.msg);
        }
    });
}

exports.findAndUpdateUserInfo = function(skey, type, callback){

    var ep = new EventProxy();
    ep.fail(callback);

    if(type === 'qq'){
        // 去 sso 拿用户名字和昵称
        exports.getUserInfoFromQQ(skey, function(err, data){
            // console.log('getUserInfoFromQQ',data);
            if(err){
                ep.emitLater('error', err);
            }else if(data){
                var userInfo = {};
                userInfo.loginName = data.openid;
                userInfo.name = data.nickname;
                ep.emitLater('getUserInfoSuccess', userInfo);
            }else{
                ep.emitLater('error', 'get qq userInfo error.');
            }
            
        });
    }else{
        // 去 sso 拿用户名字和昵称
        exports.getUserInfo(skey, function(err, data){
            if(err){
                ep.emitLater('error', err);
            }else if(data.success && data.userInfo){
                ep.emitLater('getUserInfoSuccess', data.userInfo);
            }else{
                ep.emitLater('error', 'get userInfo error.');
            }
        });
    }
    
    // 查询 user 数据库, 更新资料
    ep.on('getUserInfoSuccess', function(userInfo){

        var name = userInfo.loginName;
        var nick = userInfo.name;

        // name 是唯一的
        mUser.getUserByName(name, function(err, user){
            if(user){ // db已经有该用户, 更新资料
                user.nick = nick;

                mUser.save(user, ep.done('updateUserSuccess'));
            }else{
                user = {
                    nick: nick,
                    name: name,
                    auth: 0, // 15 是管理员
                    size: config.DEFAULT_USER_SPACE,
                };
                if(type === 'qq'){
                    user.from = 'qq';
                }
                mUser.create(user, ep.done('updateUserSuccess'));
            }
        });
    });

    // 把拿到的用户信息回调
    ep.on('updateUserSuccess', function(user){
        callback(null, user);
    });
}