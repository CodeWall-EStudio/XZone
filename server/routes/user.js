var http = require('http');
var querystring = require('querystring');
var EventProxy = require('eventproxy');
var OAuth2 = require('oauth').OAuth2;
var us = require('underscore');

var CAS = require('../lib/cas');
var config = require('../config');
var ERR = require('../errorcode');
var Util = require('../util');
var Logger = require('../logger');
var userHelper = require('../helper/user_helper');

var mUser = require('../models/user');
var mGroup = require('../models/group');
var mMessage = require('../models/message');
var mOrganization = require('../models/organization');

var cas = new CAS({
    base_url: config.CAS_BASE_URL,
    service: config.APP_DOMAIN + config.CAS_SERVICE
});

var oauth = new OAuth2(
    config.QQ_CONNECT_APPID,
    config.QQ_CONNECT_APPKEY,
    config.QQ_CONNECT_SITE,
    config.QQ_CONNECT_AUTH_PATH,
    config.QQ_CONNECT_TOKEN_PATH
);

exports.gotoLogin = function(req, res) {
    var type = req.type || req.param('type') || 'self';
    var url;
    if (config.AUTH_TYPE !== 'auto') {
        type = config.AUTH_TYPE;
    }
    Logger.info('[gotoLogin] login with ' + type);
    if (type === 'qq') {
        var state = Date.now();
        req.session[state] = 'qq';
        url = oauth.getAuthorizeUrl({
            'response_type': 'code',
            'redirect_uri': config.APP_DOMAIN + config.QQ_CONNECT_CALLBACK,
            state: state
        });
    } else if (type === 'sso') {
        url = cas.getLoginUrl();
    } else {
        url = config.LOGIN_PAGE;
    }
    Logger.info('[gotoLogin] redirect to: ' + url);
    res.redirect(url);
};


exports.get = function(req, res) {

    var loginUser = req.loginUser;

    mUser.getUserAllInfo(loginUser, function(err, data) {
        if (err) {
            res.json({
                err: data || ERR.SERVER_ERROR,
                msg: err
            });
        } else {
            var user = us.extend({}, data.user);
            Util.removePrivateMethods(user);
            delete user.pwd;

            data.user = user;
            res.json({
                err: ERR.SUCCESS,
                result: data
            });
        } // end of else 
    });
};

exports.info = function(req, res) {

    var user = req.parameter.userId;
    delete user.pwd;
    Util.removePrivateMethods(user);

    mOrganization.getOrgsByUserId(user._id, function(err, result) {

        if (!err) {
            res.json({
                err: ERR.SUCCESS,
                result: {
                    user: user,
                    organizations: result
                }
            });
        } else {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        }
    });

};

var validateTicket = function(ticket, callback) {
    var ep = new EventProxy();

    ep.fail(callback);

    cas.validate(ticket, function(err, status, response) {

        if (err) {
            return ep.emit('error', err);
        } else if (!status) {
            return ep.emit('error', 'the ticket "' + ticket + '" is not correct!', ERR.TICKET_ERROR);
        }
        var data = JSON.parse(response);

        ep.emit('validate', data);
    }); // end validate

    ep.on('validate', function(data) {
        var skey = data.encodeKey;

        userHelper.findAndUpdateUserInfo(skey, 'sso', ep.done('userInfo'));
    });

    ep.all('validate', 'userInfo', function(valData, user) {
        callback(null, valData, user);
    });
};

exports.loginSuccess = function(req, res, next) {
    req.redirectUrl = config.INDEX_PAGE;

    var ticket = req.param('ticket');

    // console.log('s sssss:',ticket);

    if (!ticket) {
        res.json({
            err: ERR.NOT_LOGIN
        });
        return;
    }
    validateTicket(ticket, function(err, valData, user) {
        if (err) {
            // res.json({err: valData || ERR.NOT_LOGIN, msg: err});
            res.redirect(LOGIN_FAIL_PAGE + '?err=' + (valData || ERR.NOT_LOGIN) + '&msg=' + String(err));
            console.log(err, valData, user);
            console.log('>>>validateTicket error:', err);
        } else {
            req.session[valData.encodeKey] = user._id.toString();
            res.cookie('skey', valData.encodeKey, {});
            // console.log('>>>validateTicket success', req.session);
            if (req.redirectUrl) {
                res.redirect(req.redirectUrl);
            } else {
                res.json({
                    err: ERR.SUCCESS,
                    result: {
                        user: user
                    }
                });
            } // end redirectUrl
        }
    });
};

exports.loginSuccessWithQQ = function(req, res, next) {
    var code = req.param('code');
    var state = req.param('state');
    var type = req.session[state];

    req.redirectUrl = config.INDEX_PAGE;

    if (type !== 'qq') { // server-side 
        res.json({
            err: ERR.TICKET_ERROR,
            msg: 'not a valid request'
        });
        return;
    }
    req.session[state] = null;

    var ep = new EventProxy();

    oauth.getOAuthAccessToken(code, {
            'grant_type': 'authorization_code',
            'redirect_uri': config.APP_DOMAIN + config.QQ_CONNECT_CALLBACK
        },
        function(err, access_token, refresh_token, data) {

            if (err) {
                res.json({
                    err: ERR.SERVER_ERROR,
                    msg: err
                });
                return;
            } else if (!access_token) {
                res.json({
                    err: ERR.TICKET_ERROR,
                    msg: 'get accessToken error'
                });
                return;
            }
            ep.emitLater('getAccessTokenSucc', access_token);

        });

    ep.on('getAccessTokenSucc', function(accessToken) {
        console.log('>>>getAccessTokenSucc: ' + accessToken);
        userHelper.findAndUpdateUserInfo(accessToken, 'qq', function(err, user) {
            if (err) {
                res.json({
                    err: user || ERR.NOT_LOGIN,
                    msg: err
                });
                console.log('>>>qq findAndUpdateUserInfo error:', err);
            } else {
                req.session[accessToken] = user._id.toString();
                res.cookie('skey', accessToken, {});

                if (req.redirectUrl) {
                    res.redirect(req.redirectUrl);
                } else {
                    res.json({
                        err: ERR.SUCCESS,
                        result: {
                            user: user
                        }
                    });
                } // end redirectUrl
            }
        });
    });

};

exports.departments = function(req, res) {
    var params = req.parameter;

    mOrganization.getOrganizationTree(params, function(err, data) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        } else {
            var departs = data.children;
            delete data.children;
            res.json({
                err: ERR.SUCCESS,
                result: {
                    root: data,
                    list: departs
                }
            });
        }
    });
};

exports.login = function(req, res) {
    var parameter = req.parameter;
    var name = parameter.name;
    var pwd = parameter.pwd;
    var json = parameter.json;

    pwd = Util.md5(pwd);

    var type = req.type || req.parameter.type || 'self';

    mUser.getUser({
        name: name,
        pwd: pwd
    }, function(err, user) {

        if (err) {
            if (json) {
                return res.json({
                    err: ERR.LOGIN_FAILURE,
                    msg: 'server error'
                });
            }
            return res.redirect(config.LOGIN_FAIL_PAGE + '?err=' + ERR.LOGIN_FAILURE);
        }
        if (!user) {
            if (json) {
                return res.json({
                    err: ERR.ACCOUNT_ERROR,
                    msg: 'account or password is wrong'
                });
            }
            return res.redirect(config.LOGIN_FAIL_PAGE + '?err=' + ERR.ACCOUNT_ERROR);
        }
        if (user.status === 1) {

            // status = 1 的用户是被关闭的, 不允许调用
            if (json) {
                return res.json({
                    err: ERR.ACCOUNT_CLOSE,
                    msg: 'account has closed'
                });
            }
            return res.redirect(config.LOGIN_FAIL_PAGE + '?err=' + ERR.ACCOUNT_CLOSE);
        }

        var skey = Util.md5(user.name + ':' + user.pwd + ':' + Date.now());

        req.session[skey] = user._id.toString();
        var mainDomain = config.APP_MAIN_DOMAIN && ('.' + config.APP_MAIN_DOMAIN) || null;
        res.cookie('skey', skey, {
            domain: mainDomain
        });

        if (json) {
            res.json({
                err: ERR.SUCCESS,
                result: {
                    skey: skey,
                    userId: user._id,
                    name: user.name,
                    nick: user.nick
                }
            });
        } else if (req.redirectUrl) {
            res.redirect(req.redirectUrl);
        } else {
            res.redirect('/');
        } // end redirectUrl
    });
};

exports.logoff = function(req, res) {
    var type = req.type || req.parameter.type || 'self';
    var json = req.parameter.json;

    if (config.AUTH_TYPE !== 'auto') {
        type = config.AUTH_TYPE;
    }

    req.session.destroy();

    res.clearCookie('skey');
    // res.clearCookie('sid');
    res.clearCookie('connect.sid');

    if (json) {
        res.json({
            err: ERR.SUCCESS,
            msg: 'ok'
        });
    } else if (type === 'qq') {
        res.redirect('/');
    } else if (type === 'sso') {
        res.redirect(cas.getLogoutUrl());
    } else {
        res.redirect('/');
    }
};

exports.validate = function(req, res) {
    var loginUser = req.loginUser;
    res.json({
        err: ERR.SUCCESS,
        result: {
            userId: loginUser._id,
            name: loginUser.name,
            nick: loginUser.nick
        }
    });
};

exports.modify = function(req, res) {
    var params = req.parameter;
    var loginUser = req.loginUser;
    var pwd = params.pwd;
    var newPwd = params.newPwd;

    var doc = {};
    if (params.nick) {
        doc.nick = params.nick;
    }

    if (pwd && newPwd && pwd !== newPwd) {
        if (Util.md5(pwd) !== loginUser.pwd) {
            return res.json({
                err: ERR.PASSWORD_ERROR,
                msg: 'pwd is wrong'
            });
        }
        doc.pwd = Util.md5(newPwd);
    }

    mUser.update({
        _id: loginUser._id
    }, doc, function(err, doc) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        } else {
            delete doc.pwd;

            res.json({
                err: ERR.SUCCESS
            });
        }
    });
};

exports.search = function(req, res) {
    var params = req.parameter;

    mUser.search(params, function(err, total, docs) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        } else {
            res.json({
                err: ERR.SUCCESS,
                result: {
                    total: total,
                    list: docs
                }
            });
        }
    });
};