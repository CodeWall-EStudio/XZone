
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var db = require('../models/db');
var ERR = require('../errorcode.js');
var U = require('../util');
var config = require('../config');
var AuthConfig = require('./auth_config');
var mUser = require('../models/user');
var mGroup = require('../models/group');
var routeUser = require('./user');


/**
 * 检查是否登录, 如果登录了, 从数据库把用户信息找出
 */
exports.checkAuth = function(req, res, next){
    var path = req.redirectPath || req.path;
    var method = req.method;
    var skey = req.cookies.skey || req.body.skey || req.query.skey;
    if (!skey) {
        skey = req.cookies.accessToken || req.body.accessToken || req.query.accessToken;
    }
    req.skey = skey;

    if (AuthConfig.AUTH_WHITE_LIST.indexOf(path) >= 0) {
        return next();
    }
    var loginUid;
    if(!req.session || !skey || !(loginUid = req.session[skey])){
        res.json({err: ERR.NOT_LOGIN, msg: 'not login'});
        return;
    }
    req.loginUid = loginUid;

    // 这里改成每次请求都从数据库读取用户信息, 为了数据的一致性, 只能牺牲下性能
    mUser.getUser({ _id: ObjectID(loginUid) }, function(err, user){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: 'verify user error' });
        }if(user){
            req.loginUser = user;
            next();
        }else{
            res.json({ err: ERR.NOT_LOGIN, msg: 'verify user error' });
        }
    });
    
};

/**
 * 检查是否登录, 如果没有登录, 跳转到登录页
 */
exports.checkAuthAndLogin = function(req, res, next){
    var path = req.redirectPath || req.path;
    var method = req.method;
    var skey = req.cookies.skey || req.body.skey || req.query.skey;
    if(!skey){
        skey = req.cookies.accessToken || req.body.accessToken || req.query.accessToken;
    }
    req.skey = skey;

    if(AuthConfig.AUTH_WHITE_LIST.indexOf(path) >= 0){
        return next();
    }
    var loginUid;
    if(!req.session || !skey || !(loginUid = req.session[skey])){
        routeUser.gotoLogin(req, res);
        return;
    }
    req.loginUid = loginUid;
    next();
};

/**
 * 检查 api 调用权限, 所有 api 权限检查都在这里完成, api 的具体实现里就不在涉及跟权限有关的代码
 * 这里会检查用户的所有角色, 包括用户角色, 文件角色, 文件夹角色, 小组角色等
 */
exports.checkAPI = function(req, res, next){
    var path = req.redirectPath || req.path;
    var loginUser = req.loginUser;
    var parameter = req.parameter;

    if (AuthConfig.AUTH_WHITE_LIST.indexOf(path) >= 0) {
        return next();
    }

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        if(errCode === ERR.NOT_FOUND && config.DOWNLOAD_APIS.indexOf(path) > -1){
            console.error(err, errCode);
            //NOTE: 下载接口, 如果找不到文件, 直接跳 404 页面
            return res.redirect(config.NOT_FOUND_PAGE);
        }
        res.json({err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    // 查询角色
    getUserRoles(loginUser, parameter, ep.doneLater('getUserRolesDone'));

    ep.on('getUserRolesDone', function(){
        /*
         * 检查该用户是否有权限调用该 api, 同时还会涉及稍微跟api实现有关的权限检查
         * 如: file/move, 会检查当前文件是否是用户可操作的, 木有文件夹是否是用户可操作的等等
         */
        checkAPIAuth(path, loginUser, parameter, ep.done('checkAPIAuthDone'));
    });

    ep.on('checkAPIAuthDone', function(){
        // 权限没有问题, 如果有问题, 就抛出 error 事件
        next();
    });
};

function getUserRoles(user, parameter, callback){
    var role = config.ROLE_NORMAL;
    if((user.auth & config.AUTH_MANAGER) || (user.auth & config.AUTH_SYS_MANAGER)){
        role |= config.ROLE_MANAGER;
    }

    mGroup.isPrepareMember(user._id, function(err, result){
        if(result){
            role |= config.ROLE_PREPARE_MEMBER;
        }
        user.__role = role;
        callback(err, user);
    });
}

function checkAPIAuth(path, user, parameter, callback){
    if(AuthConfig.AUTH_WHITE_LIST.indexOf(path) > -1){
        return callback(null);
    }
    var rule = AuthConfig.RULES[path];
    if(!rule || !rule.verify){
        return callback(null);
    }
    rule.verify(user, parameter, callback);
}