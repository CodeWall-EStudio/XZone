var CAS = require('../lib/cas');
var config = require('../config');
var ERR = require('../errorcode');
var userHelper = require('../helper/user_helper');

var mUser = require('../models/user');
var mGroup = require('../models/group');
var mMessage = require('../models/message');

var http = require('http');
var querystring = require('querystring');
var EventProxy = require('eventproxy');


var cas = new CAS({
    base_url: config.CAS_BASE_URL,
    service: config.CAS_SERVICE
});



exports.gotoLogin = function(req, res){
    var url = cas.getLoginUrl();

    res.redirect(url);
}

exports.get = function(req, res){

    var loginUser = req.loginUser;
    mUser.getUserInfoByName(loginUser.name, function(err, user, groups){
        if(err){
            res.json({ err: user || ERR.SERVER_ERROR, msg: err});
        }else{
            mMessage.getUnReadNum(loginUser._id, function(err, count){

                user.mailnum = count;
                res.json({
                    err: ERR.SUCCESS,
                    result: {
                        user: user,
                        groups: groups
                    }
                });
            });
        }// end of else 
    });
}

var validateTicket = function(ticket, callback){
    var ep = EventProxy.create('validate', 'userInfo', 'saveUser', 
            function(valData, userInfo, user){
        
        callback(null, valData, user);

    });

    ep.fail(function(err, errCode){
        callback(err, errCode);
    });

    ep.on('userInfo', function(userInfo){

        var name = userInfo.loginName;
        var nick = userInfo.name;

        // name 是唯一的
        mUser.getUserByName(name, function(err, user){
            if(user){ // db已经有该用户, 更新资料
                user.nick = nick;

                mUser.save(user, ep.done('saveUser'));
            }else{
                mUser.create({
                    nick: nick,
                    name: name,
                    auth: 0, // 15 是管理员
                    size: config.DEFAULT_USER_SPACE,
                }, ep.done('saveUser'));
            }
        });
    }); // end userInfoProxy

    cas.validate(ticket, ep.done('validate', function(status, response){
        if(!status){
            ep.emit('error', 'the ticket "' + ticket + '" is not correct!', ERR.TICKET_ERROR);
            return null;
        }

        var data = JSON.parse(response);
        var skey = data.encodeKey;

        userHelper.getUserInfo(skey, ep.done('userInfo', function(data){
            if(data.success && data.userInfo){
                // userInfoProxy.emit('userInfo', data.userInfo);
                return data.userInfo;
            }else{
                ep.emit('error', 'get userInfo error.');
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
        validateTicket(ticket, function(err, valData, user){
            if(err){
                res.json({err: valData || ERR.NOT_LOGIN, msg: err});
                console.log('>>>validateTicket error', err);
            }else{
                req.session[valData.encodeKey] = user;
                res.cookie('skey', valData.encodeKey, { });
                // console.log('>>>validateTicket success', req.session);
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
    req.redirectUrl = '/index.html';

    exports.login(req, res, next);

}


exports.logoff = function(req, res){
    req.session = null;
    res.clearCookie('skey');
    res.clearCookie('connect.sid');

    exports.gotoLogin(req, res);
    // res.redirect('/');
    // res.json({ err: ERR.SUCCESS });
}

exports.search = function(req, res){
    var params = req.query;

    mUser.search(params, function(err, total, docs){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    total: total,
                    list: docs
                }
            });
        }
    });
}
