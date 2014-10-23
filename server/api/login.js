var EventProxy = require('eventproxy');
var querystring = require('querystring');
var OAuth2 = require('oauth').OAuth2;
var us = require('underscore');
var ObjectID = require('mongodb').ObjectID;


var config = require('../config');
var ERR = require('../errorcode');
var Util = require('../util');
var Logger = require('../logger');

var db = require('../models/db');
var mUser = require('../models/user');
var mSizegroup = require('../models/sizegroup');


var oauth = new OAuth2(
    config.USERCENTER_CLIENT_ID,
    config.USERCENTER_CLIENT_SECRET,
    config.USERCENTER_SITE,
    config.USERCENTER_AUTH_PATH,
    config.USERCENTER_TOKEN_PATH
);

function findAndUpdateUserInfo(accessToken, callback) {

    var ep = new EventProxy();
    ep.fail(callback);

    // 拿用户名字和昵称
    var url = config.USERCENTER_SITE + config.USERCENTER_OPENID_PATH;
    oauth.get(url, accessToken, function(err, data) {

        try {
            data = JSON.parse(data);
        } catch (e) {
            return ep.emitLater('error', e, ERR.NOT_LOGIN);

        }
        if (err) {

            ep.emitLater('error', err);
        } else if (data) {

            var userInfo = {};
            userInfo.openid = data.open_id;
            userInfo.nick = data.nick;
            userInfo.username = data.username;
            ep.emitLater('getUserInfoSuccess', userInfo);
        } else {
            ep.emitLater('error', 'get userInfo error.');
        }
    });

    // 如果没有传 size , 就用默认的 size
    mSizegroup.getSizegroup({
        type: 0,
        isDefault: true
    }, ep.done('getSizegroup'));

    // 查询 user 数据库, 更新资料
    ep.all('getUserInfoSuccess', 'getSizegroup', function(userInfo, sizegroup) {

        // 先用 openid 查查有没有该用户
        db.user.findOne({
            openid: userInfo.openid
        }, function(err, user) {
            if (user) { // db已经有该用户, 更新资料
                user.nick = userInfo.nick;
                user.name = userInfo.username;
                mUser.save(user, ep.done('updateUserSuccess'));
            } else {
                user = {
                    openid: userInfo.openid,
                    nick: userInfo.nick,
                    name: userInfo.username,
                    auth: 0, // 15 是管理员
                    size: config.DEFAULT_USER_SPACE
                };
                if (sizegroup) {
                    user.sizegroupId = sizegroup._id;
                    user.size = sizegroup.size;
                }
                user.from = 'uc';
                mUser.create(user, ep.done('updateUserSuccess'));
            }
        });
    });

    // 把拿到的用户信息回调
    ep.on('updateUserSuccess', function(user) {
        callback(null, user);
    });
}

// 调用 oauth 的授权模式换取 token
exports.get = function(req, res) {
    var state = Date.now();
    req.session[state] = 'usercenter';
    var url = oauth.getAuthorizeUrl({
        'response_type': 'code',
        'redirect_uri': config.APP_DOMAIN + config.USERCENTER_CALLBACK,
        state: state
    });
    Logger.info('[login:get] redirect to: ' + url);
    res.redirect(url);
};

// 直接使用密码换取 token
exports.post = function(req, res) {
    var name = req.param('name');
    var pwd = req.param('pwd');

    if (!name || !pwd) {
        res.json({
            err: ERR.PARAM_ERROR,
            msg: 'name or pwd is empty!'
        });
        return;
    }
    // var name = req.parameter.name;
    // var pwd = req.parameter.pwd;

    var data = {
        'grant_type': 'password',
        'client_id': config.USERCENTER_CLIENT_ID,
        'client_secret': config.USERCENTER_CLIENT_SECRET,
        'username': name,
        'password': pwd
    };

    data = querystring.stringify(data);

    Util.request({
        url: config.USERCENTER_SITE + config.USERCENTER_TOKEN_PATH,
        method: 'POST',
        data: data,
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": data.length
        }

    }, function(err, data) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
            return;
        }
        if (!data) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: 'the usercenter server does not return any thing'
            });
            return;
        }
        try {
            data = JSON.parse(data);
        } catch (e) {
            Logger.error('[loign:post] Error', data);
            res.json({
                err: ERR.SERVER_ERROR,
                msg: '[loign:post] JSON parse error: ' + e.message
            });
            return;
        }

        var accessToken = data.access_token;
        if (!accessToken) {
            res.json({
                err: ERR.TICKET_ERROR,
                msg: 'get accessToken error'
            });
            return;
        }

        findAndUpdateUserInfo(accessToken, function(err, user) {

            if (err) {
                res.json({
                    err: user || ERR.NOT_LOGIN,
                    msg: err
                });
                Logger.error('>>>qq findAndUpdateUserInfo error:', err);
            } else {
                req.session[accessToken] = user._id.toString();
                res.cookie('skey', accessToken, {});

                res.json({
                    err: ERR.SUCCESS,
                    result: {
                        skey: accessToken,
                        userId: user._id,
                        name: user.name,
                        nick: user.nick
                    }
                });

            }

        });

    });
};

exports.loginUCSuccess = function(req, res, next) {
    var code = req.param('code');
    var state = req.param('state');

    req.session[state] = null;

    oauth.getOAuthAccessToken(code, {
        'grant_type': 'authorization_code',
        'redirect_uri': config.APP_DOMAIN + config.USERCENTER_CALLBACK
    }, function(err, accessToken /*, refreshToken, data*/ ) {

        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
            return;
        } else if (!accessToken) {
            res.json({
                err: ERR.TICKET_ERROR,
                msg: 'get accessToken error'
            });
            return;
        }
        Logger.info('getAccessTokenSucc: ' + accessToken);

        findAndUpdateUserInfo(accessToken, function(err, user) {

            if (err) {
                res.json({
                    err: user || ERR.NOT_LOGIN,
                    msg: err
                });
                Logger.error('>>>qq findAndUpdateUserInfo error:', err);
            } else {
                req.session[accessToken] = user._id.toString();
                res.cookie('skey', accessToken, {});

                res.redirect(config.INDEX_PAGE);
            }

        });
    });


};

exports.checkLogin = function(req, res, next) {
    var path = req.redirectPath || req.path;
    var method = req.method;
    var skey = req.cookies.skey || req.body.skey || req.query.skey;
    if (!skey) {
        skey = req.cookies.accessToken || req.body.accessToken || req.query.accessToken;
    }
    req.skey = skey;

    Logger.debug('[checkLogin]', 'req.redirectPath: ', req.redirectPath);

    function fetchUserSuccess(err, user) {
        if (err) {
            res.json({
                err: user || ERR.SERVER_ERROR,
                msg: 'verify user error'
            });
            Logger.error('[checkLogin] verify user error: ', user, ':', err, 'path: ', path, ', method: ', method);
        } else if (user) {

            if (user.status === 1) {

                // status = 1 的用户是被关闭的, 不允许调用
                res.json({
                    err: ERR.FORBIDDEN,
                    msg: 'this user has close, can\'t access the api'
                });

            } else {

                req.loginUid = user._id.toString();
                req.loginUser = user;
                req.session[skey] = req.loginUid;
                res.cookie('skey', skey, {});
                next();
            }

        } else {
            res.json({
                err: ERR.NOT_LOGIN,
                msg: 'verify user error, con\'t find user in db'
            });
            Logger.info('[checkLogin] verify user error, con\'t find user in db', 'path: ', path, ', method: ', method);
        }
    }

    if (req.session) {
        var loginUid = req.session[skey];
        if (loginUid) {
            mUser.getUser({
                _id: new ObjectID(loginUid)
            }, fetchUserSuccess);
            return;
        } else if (skey) {

            findAndUpdateUserInfo(skey, fetchUserSuccess);
            Logger.info('[checkLogin] not login. try to use skey to reauth, skey: ', skey);
            return;
        }
    }
    res.json({
        err: ERR.NOT_LOGIN,
        msg: 'not login'
    });

    Logger.info('[checkLogin] not login.', 'path: ', path, ', method: ', method, ', skey: ', skey);
};

exports.logoff = function(req, res) {
    // var json = req.parameter.json;

    var json = req.param('json');
    if (json) {
        json = (!json || json === 'false' || json === '0') ? false : true;
    }

    req.session.destroy();

    res.clearCookie('skey');
    res.clearCookie('connect.sid');

    if (json) {
        res.json({
            err: ERR.SUCCESS,
            msg: 'ok'
        });
    } else {
        res.redirect('/');
    }
};