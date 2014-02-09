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
    var url = cas.getLoginUrl();

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

exports.validate = function(ticket, callback){
    var loginProxy = EventProxy.create('validate', 'userInfo', 'saveUser', 
            function(valData, userInfo, user){
        
        callback(null, valData, user);

    });

    loginProxy.fail(function(err, errCode){
        callback(err, errCode);
    });

    var userInfoProxy = EventProxy.create('userInfo', function(userInfo){
        var name = userInfo.loginName;
        var nick = userInfo.name;

        // name 是唯一的
        mUser.getUserByName(name, function(err, user){
            if(user){ // db已经有该用户, 更新资料
                user.nick = nick;

                mUser.save(user, loginProxy.done('saveUser'));
            }else{
                mUser.create({
                    nick: nick,
                    name: name,
                    auth: 0, // 15 是管理员
                    size: config.DEFAULT_USER_SPACE,
                }, loginProxy.done('saveUser'));
            }
        });
    }); // end userInfoProxy

    cas.validate(ticket, loginProxy.done('validate', function(status, response){
        if(!status){
            loginProxy.emit('error', 'the ticket "' + ticket + '" is not correct!', ERR.TICKET_ERROR);
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
    })); // end validate
}

exports.login = function(req, res){
    var ticket = req.body.ticket || req.query.ticket;

    if(!ticket){
        res.json({err: ERR.NOT_LOGIN});
    }else{
        exports.validate(ticket, function(err, valData, user){
            if(err){
                res.json({err: valData || ERR.NOT_LOGIN, msg: err});
            }else{
                req.session[valData.encodeKey] = user;
                res.cookie('skey', valData.encodeKey, { });

                if(req.redirectUrl){
                    res.redirect(req.redirectUrl);
                }else{
                    res.json({
                        err: ERR.SUCCESS,
                        result: {
                            user: user
                        }
                    });
                }// end redirectUrl
            }
        });
    }
}

exports.loginSuccess = function(req, res, next){
    req.redirectUrl = '/';

    exports.login(req, res, next);

}


exports.logoff = function(req, res){
    req.session = null;
    res.clearCookie('skey');
    res.json({ err: ERR.SUCCESS });
}

exports.search = function(req, res){
    //TODO
}
