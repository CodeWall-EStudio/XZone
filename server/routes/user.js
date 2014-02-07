var CAS = require('../lib/cas');
var config = require('../config');
var ERR = require('../errorcode');

var mUser = require('../models/user');
var mGroup = require('../models/group');

var http = require('http');
var querystring = require('querystring');
var EventProxy = require('eventproxy');


var cas = new CAS({
    base_url: config.CAS_BASE_URL,
    service: config.CAS_SERVICE
});


function getUserInfo(skey, callback){
    var data = querystring.stringify({
        encodeKey: skey
    });
    var req = http.request({
        host: 'mapp.71xiaoxue.com',
        path: '/components/getUserInfo.htm',
        method: 'POST',
        headers: {  
            "Content-Type": 'application/x-www-form-urlencoded',  
            "Content-Length": data.length  
        }  
    }, function(res){
        res.setEncoding('utf8');
        var response = '';
        res.on('data', function(chunk){
            response += chunk;
        });
        res.on('end', function(){
            callback(null, JSON.parse(response));
        })
    });
    req.write(data + '\n');
    req.end();
}

exports.gotoLogin = function(req, res){
    var url = config.CAS_BASE_URL + '/login?service=' + config.CAS_SERVICE;
    res.redirect(url);
}

exports.get = function(req, res){

    var loginUser = req.loginUser;
    mUser.getUserInfoByName(loginUser.name, function(err, user, groups){
        if(err){
            res.json({ err: user || ERR.SERVER_ERROR, msg: err});
        }else {
            res.json({
                err: ERR.SUCCESS,
                result: {
                    user: user,
                    groups: groups
                }
            });
        }// end of else 
    });
}

exports.login = function(req, res){
    var ticket = req.body.ticket || req.query.ticket;

    if(!ticket){
        res.json({err: ERR.NOT_LOGIN});
    }else{
        var loginProxy = EventProxy.create('validate', 'userInfo', 'saveUser', 'groups', function(valData, userInfo, user, groups){
            req.session[valData.encodeKey] = user;

            res.cookie('skey', valData.encodeKey, { httpOnly: true });
            res.json({
                err: ERR.SUCCESS,
                result: {
                    user: user,
                    groups: groups // 该用户参加的小组列表
                }
            });
        });

        loginProxy.fail(function(err){
            res.json({err: ERR.SERVER_ERROR, msg: err});
        })

        var userInfoProxy = EventProxy.create('userInfo', function(userInfo){
            var name = userInfo.loginName;
            var nick = userInfo.name;

            // name 是唯一的
            mUser.getUserByName(name, function(err, user){
                if(user){ // db已经有该用户, 更新资料
                    user.nick = nick;

                    mGroup.getGroupByUser(user._id.toString(), loginProxy.done('groups'));

                }else{
                    user = {
                        nick: nick,
                        name: name,
                        auth: 0,
                        size: config.DEFAULT_USER_SPACE,
                        used: 0,
                        mailnum: 0,
                        lastGroup: null
                    }
                }
                mUser.save(user, loginProxy.done('saveUser'));
            });
        });

        cas.validate(ticket, loginProxy.done('validate', function(status, response){
            if(!status){
                res.json({err: ERR.TICKET_ERROR, msg: 'the ticket "' + ticket + '" is not correct!'});
                return null;
            }

            var data = JSON.parse(response);
            var skey = data.encodeKey;

            getUserInfo(skey, loginProxy.done('userInfo', function(data){
                if(data.success && data.userInfo){
                    userInfoProxy.emit('userInfo', data.userInfo);
                    return data.userInfo;
                }else{
                    loginProxy.emit('error', 'get userInfo error.');
                }
            }));

            return data;
        }));
    }
}

exports.logoff = function(req, res){
    req.session = null;
    res.clearCookie('skey');
    res.json({ err: ERR.SUCCESS });
}

exports.search = function(req, res){
    //TODO
}
