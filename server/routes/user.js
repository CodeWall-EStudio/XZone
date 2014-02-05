var CAS = require('node-cas');
var config = require('../config');
var ERR = require('../errorcode');

var mUser = require('../models/user');
var mGroup = require('../models/group');

var http = require('http');
var querystring = require('querystring');
var EventProxy = require('eventproxy');

var ObjectID = require('mongodb').ObjectID;

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
    var skey = req.cookies.skey;
    getUserInfo(skey, function(err, userInfo){
        res.send(userInfo);
    });
}

exports.login = function(req, res){
    var ticket = req.body.ticket || req.query.ticket;

    if(!ticket){
        res.json({err: ERR.NOT_LOGIN});
    }else{
        var loginProxy = EventProxy.create('validate', 'userInfo', 'saveUser', 'groups', function(valData, userInfo, user, groups){
            req.session[valData.encodeKey] = {
                _id: user._id,
                name: user.name
            };

            res.cookie('skey', valData.encodeKey, { httpOnly: true });
            res.json({
                err: ERR.SUCCESS,
                result: {
                    nick: user.nick, // 中文名
                    name: user.name, // 拼音, 唯一
                    auth: user.auth,
                    size: user.size,
                    used: user.used,
                    lastgroup: user.lastgroup,
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
            mUser.findOne({ name: name}, function(err, doc){
                if(doc){ // db已经有该用户, 更新资料
                    doc.nick = nick;

                    mGroup.listUserGroups({ uid: doc._id }, loginProxy.done('groups'));

                }else{
                    doc = {
                        nick: nick,
                        name: name,
                        auth: 0,
                        size: config.DEFAULT_USER_SPACE,
                        used: 0,
                        lastgroup: null
                    }
                }
                mUser.save(doc, function(err, result){
                    mUser.findOne({ _id: doc._id }, loginProxy.done('saveUser'));
                });
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
