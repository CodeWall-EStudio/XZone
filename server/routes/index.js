var ERR = require('../errorcode');
var routeUser = require('./user');
var U = require('../util');
var config = require('../config');

var ROUTER_CONFIG = require('./router_config');

var WHITE_LIST = [
    '/api/user/login',
    '/api/user/logoff',
    '/api/user/gotoLogin',
    '/api/user/loginSuccess',
    '/api/media/upload',
    '/api/media/download'
];

var ADMIN_CGI = '/api/manage/';
var MEDIA_UPLOAD_CGI = '/api/media/upload';

function getRouter(path, method){

    var arr = path.split('/');
    if(arr[1] === 'api'){
        var module = require('./' + arr[2]);
        if(arr[3]){
            return module[arr[3]];
        }else{
            return module[method.toLowerCase()];
        }
    }
    return null;
}

function getVerifyMsg(field, value, condition){
    // console.log('verifyParams:', field, value, condition);
    var type = condition[0];
    if(type === 'array'){
        if(!value.forEach){
            return field + ' must be an array';
        }
        var msg, con = condition.slice(1);
        for(var i = 0; i < value.length; i++){
            msg = getVerifyMsg(field+'[' + i + ']', value[i], con);
            if(msg){
                return msg;
            }
        }
    }else if(type === 'object'){
        try{
            value = U.jsonParse(value);
        }catch(e){
            return field + ' must be an object';
        }
    }else if(type === 'string'){
        if(condition.length > 1 && value.length < condition[1]){
            return field + ' is too short, at least ' + condition[1] + ' letters';
        }
    }else if(type === 'number'){
        value = Number(value);
        if(isNaN(value)){
            return field + ' must be an number';
        }
        if(condition.length > 1 &&  value < condition[1]){
            return field + ' must greater than ' + condition[1];
        }
        if(condition.length > 2 && value > condition[2]){
            return field + ' must less than ' + condition[2];
        }
    }/*else if(type === 'boolean'){
        if(value === 'true' || value === '0'){
            value = true;
        }
    }*/
}

function verifyParam(req, map, required, all){
    var field, condition, value, msg, parameter;
    if(req.method === 'POST'){
        parameter = req.body;
    }else if(req.method === 'GET'){
        parameter = req.query;
    }

    for(field in map){
        condition = map[field];
        if(all){
            value = req.param(field);
        }else{
            value = parameter[field];
        }
        if(typeof value !== 'undefined'){
            if(msg = getVerifyMsg(field, value, condition)){
                return msg;
            }
        }else if(required){
            // console.log('verifyParams:', field, value, condition);
            return field + ' is required';
        }
    }
    return null;
}

function verifyParams(req, config){
    var msg, map;
    if((map = config.require) && (msg = verifyParam(req, map, true)) ){
        return msg;
    }

    if((map = config.optional) && (msg = verifyParam(req, map, false)) ){
        return msg;
    }

    if((map = config.all) && (msg = verifyParam(req, map, true, true)) ){
        return msg;
    }
    return null;
}

exports.verifyAndLogin = function(req, res, next){
    var skey = req.cookies.skey;
    var loginUser;
    console.log('>>>verifyAndLogin', req.session);
    if(!req.session || !skey || !(loginUser = req.session[skey])){
        routeUser.gotoLogin(req, res);
    }else{
        next();
    }
}

exports.verify = function(req, res, next){
    var path = req.path;
    if(WHITE_LIST.indexOf(path) >= 0){
        next();
    }else{
        var skey = req.cookies.skey;

        var loginUser;

        if(!req.session || !skey || !(loginUser = req.session[skey])){
            res.json({err: ERR.NOT_LOGIN, msg: 'not login'});
            return;
        }
        // if(path.indexOf(ADMIN_CGI) > -1 && !U.hasRight(loginUser.auth, CFG.AUTH_MANAGER)){
        //     // 是后台管理的 cgi
        //     res.json({err: ERR.NOT_AUTH, msg: 'not auth'});
        //     return;
        // }
        req.loginUser = loginUser;
        next();
    }
}

exports.route = function(req, res, next){
    var path = req.path, 
        method = req.method,
        params,
        config,
        verifyMsg;
    var router = getRouter(path, method);
    if(router){
        if(config = ROUTER_CONFIG[path]){
            if(config.method && config.method !== method){
                res.json({ err: ERR.NOT_SUPPORT, msg: 'not support method [' + method + ']' });
                return;
            }
            if(verifyMsg = verifyParams(req, config)){
                res.json({ err: ERR.PARAM_ERROR, msg: verifyMsg });
                return;
            }
        }
        router(req, res, next);
    }else{
        next();
    }
};


exports.mediaUpload = function(req, res, next){
    var params = req.body;
    var type = Number(params.media) || 0;
    //设置跨域请求用的返回头
    res.set({
        'Access-Control-Allow-Origin': config.MEDIA_CORS_URL,
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Origin,Content-Type',
        'Access-Control-Max-Age': '30'
    });
    if(req.method === 'OPTIONS'){
        res.send(200);
        return;
    }
    if(type === 1){
        // 新媒体的上传, 路由到 media/upload
        getRouter(MEDIA_UPLOAD_CGI, req.method)(req, res, next);
        // res.redirect('/api/media/upload');
    }else{
        next();
    }
}



