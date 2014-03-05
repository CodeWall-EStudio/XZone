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
    var type = req.type || req.query.type || 'cas';
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
}

exports.get = function(req, res){

    var loginUser = req.loginUser;
    
    mUser.getUserAllInfo(loginUser._id, function(err, data){
        if(err){
            res.json({ err: data || ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: data
            });
        }// end of else 
    });
}

var validateTicket = function(ticket, callback){
    var ep = EventProxy.create('validate', 'userInfo', 
            function(valData, user){
        
        callback(null, valData, user);

    });

    ep.fail(callback);

    cas.validate(ticket, ep.done('validate', function(status, response){
        if(!status){
            ep.emit('error', 'the ticket "' + ticket + '" is not correct!', ERR.TICKET_ERROR);
            return null;
        }

        var data = JSON.parse(response);
        var skey = data.encodeKey;

        userHelper.findAndUpdateUserInfo(skey, 'sso', ep.done('userInfo'));

        return data;
    })); // end validate
}

exports.loginSuccess = function(req, res, next){
    req.redirectUrl = '/index.html';

    var ticket = req.body.ticket || req.query.ticket;

    if(!ticket){
        res.json({err: ERR.NOT_LOGIN});
        return;
    }
    validateTicket(ticket, function(err, valData, user){
        if(err){
            res.json({err: valData || ERR.NOT_LOGIN, msg: err});
            console.log('>>>validateTicket error:', err);
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

exports.loginSuccessWithQQ = function(req, res, next){
    var params = req.query;
    var code = params.code;
    var state = params.state;
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
                req.session[accessToken] = user;
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

}


exports.logoff = function(req, res){

    req.session.destroy();

    res.clearCookie('skey');
    res.clearCookie('connect.sid');

    res.redirect('/');
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
