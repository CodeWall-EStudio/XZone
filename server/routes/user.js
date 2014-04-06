var http = require('http');
var querystring = require('querystring');
var EventProxy = require('eventproxy');
var OAuth2 = require('oauth').OAuth2;

var CAS = require('../lib/cas');
var config = require('../config');
var ERR = require('../errorcode');
var U = require('../util');
var userHelper = require('../helper/user_helper');

var mUser = require('../models/user');
var mGroup = require('../models/group');
var mMessage = require('../models/message');

var cas = new CAS({
    base_url: config.CAS_BASE_URL,
    service: config.CAS_SERVICE
});

var oauth = new OAuth2(
    config.QQ_CONNECT_APPID,
    config.QQ_CONNECT_APPKEY,
    config.QQ_CONNECT_SITE,
    config.QQ_CONNECT_AUTH_PATH,
    config.QQ_CONNECT_TOKEN_PATH
);

exports.gotoLogin = function(req, res){
    var type = req.type || req.param('type') || 'cas';
    var url;
    if(config.AUTH_TYPE !== 'auto'){
        type = config.AUTH_TYPE;
    }
    console.log('>>>gotoLogin login with ' + type);
    if(type === 'qq'){
        var state = Date.now();
        req.session[state] = 'qq';
        url = oauth.getAuthorizeUrl({
            response_type: 'code',
            redirect_uri: config.QQ_CONNECT_CALLBACK,
            state: state
        });
    }else{
        url = cas.getLoginUrl();
    }

    res.redirect(url);
};


exports.get = function(req, res){

    var loginUser = req.loginUser;

    for(var i in loginUser){
        if(i.indexOf('__') >= -1){
            delete loginUser[i];
        }
    }

    mUser.getUserAllInfo(loginUser, function(err, data){
        if(err){
            res.json({ err: data || ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: data
            });
        }// end of else 
    });
};

var validateTicket = function(ticket, callback){
    var ep = new EventProxy();

    ep.fail(callback);

    cas.validate(ticket, function(err, status, response){

        if (err) {
            return ep.emit('error', err);
        } else if (!status) {
            return ep.emit('error', 'the ticket "' + ticket + '" is not correct!', ERR.TICKET_ERROR);
        }
        var data = JSON.parse(response);

        ep.emit('validate', data);
    }); // end validate

    ep.on('validate', function(data){
        var skey = data.encodeKey;

        userHelper.findAndUpdateUserInfo(skey, 'sso', ep.done('userInfo'));
    });

    ep.all('validate', 'userInfo', function(valData, user){
        callback(null, valData, user);
    });
};

exports.loginSuccess = function(req, res, next){
    req.redirectUrl = '/index.html';

    var ticket = req.param('ticket');

    // console.log('s sssss:',ticket);

    if(!ticket){
        res.json({err: ERR.NOT_LOGIN});
        return;
    }
    validateTicket(ticket, function(err, valData, user){
        if(err){
            // res.json({err: valData || ERR.NOT_LOGIN, msg: err});
            res.redirect('/loginfail.html');
            console.log(err,valData,user);
            console.log('>>>validateTicket error:', err);
        }else{
            req.session[valData.encodeKey] = user._id.toString();
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
};

exports.loginSuccessWithQQ = function(req, res, next){
    var code = req.param('code');
    var state = req.param('state');
    var type = req.session[state];

    req.redirectUrl = '/index.html';

    if(type !== 'qq'){ // server-side 
        res.json({ err: ERR.TICKET_ERROR, msg: 'not a valid request' });
        return;
    }
    req.session[state] = null;

    var ep = new EventProxy();

    oauth.getOAuthAccessToken(code, {
                'grant_type': 'authorization_code',
                'redirect_uri': config.QQ_CONNECT_CALLBACK
            },
            function (err, access_token, refresh_token, data){

        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err });
            return;
        }else if(!access_token){
            res.json({ err: ERR.TICKET_ERROR, msg: 'get accessToken error'});
            return;
        }
        ep.emitLater('getAccessTokenSucc', access_token);

    });

    ep.on('getAccessTokenSucc', function(accessToken){
        console.log('>>>getAccessTokenSucc: ' + accessToken);
        userHelper.findAndUpdateUserInfo(accessToken, 'qq', function(err, user){
            if(err){
                res.json({err: user || ERR.NOT_LOGIN, msg: err});
                console.log('>>>qq findAndUpdateUserInfo error:', err);
            }else{
                req.session[accessToken] = user._id.toString();
                res.cookie('skey', accessToken, { });

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
    });

};

exports.departments = function(req, res){
    var params = req.parameter;

    mUser.getAllDepartments(params, function(err, data){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    list: data.children
                }
            });
        }
    });
};


exports.logoff = function(req, res){
    var type = req.type || req.parameter.type || 'cas';

    if(config.AUTH_TYPE !== 'auto'){
        type = config.AUTH_TYPE;
    }

    req.session.destroy();

    res.clearCookie('skey');
    res.clearCookie('connect.sid');
    if(type === 'qq'){
        res.redirect('/');
    }else{
        res.redirect(cas.getLogoutUrl());
    }
};

exports.search = function(req, res){
    var params = req.parameter;

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
};
