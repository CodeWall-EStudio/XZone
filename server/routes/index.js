var ERR = require('../errorcode');
var routeUser = require('./user');

var ROUTER_CONFIG = require('./router_config');

var WHITE_LIST = [
    '/api/user/login',
    '/api/user/gotoLogin',
    '/api/user/loginSuccess'
];

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

function verifyParams(req, config){
    var field, condition, value, type;
    if(config.require){
        for(field in config.require){
            condition = config.require[field];
            type = condition[0];
            if(value = req.param(field)){
                if(type === 'string'){
                    if(value.length < condition[1]){
                        return field + ' is too short, require ' + condition[1] + ' letters';
                    }
                }else if(type === 'number'){
                    value = Number(number);
                    if(isNaN(value)){
                        return field + ' must be an number.';
                    }
                    if(value < condition[1]){
                        return field + ' must be greater than ' + condition[1];
                    }
                    if(condition[2] && value > condition[2]){
                        return field + ' must be less than ' + condition[2];
                    }
                }/*else if(type === 'boolean'){
                    if(value === 'true' || value === '0'){
                        value = true;
                    }
                }*/
            }else{
                return field + ' is required';
            }
        }
    }
    return null;
}

exports.verifyAndLogin = function(req, res, next){
    var skey = req.cookies.skey;
    var loginUser = req.session[skey];

    if(!loginUser){
        routeUser.gotoLogin(req, res);
    }else{
        next();
    }
}

exports.verify = function(req, res, next){
    if(WHITE_LIST.indexOf(req.path) >= 0){
        next();
    }else{
        var skey = req.cookies.skey;
        var loginUser = req.session[skey];

        if(!loginUser){
            res.json({err: ERR.NOT_LOGIN, msg: 'not login'});
        }else{
            req.loginUser = loginUser;
            next();
        }
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
            router(req, res, next);
        }else{
            router(req, res, next);
        }
    }else{
        next();
    }
};