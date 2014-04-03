
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var db = require('../models/db');
var ERR = require('../errorcode.js');
var U = require('../util');
var ParamConfig = require('./param_config');

var ObjectIDLength = 24;

// 封装一下查询数据库的方法
function findOne(coll, value, pcfg, callback){
    if(value.length !== ObjectIDLength){
        return callback(pcfg.name + '\'s length must be ' + ObjectIDLength);
    }
    db[coll].findOne({ _id: ObjectID(value) }, function(err, doc){
        if(err){
            return callback(err);
        }
        if(!doc){
            return callback('can\' find ' + value, ERR.NOT_FOUND);
        }
        callback(null, doc);
    });
}

function findArray(coll, value, pcfg, callback){
    if(!value.forEach){
        return callback(pcfg.name + ' must be an array');
    }
    if(!value.length){
        return callback(null, value);
    }

    var ep = new EventProxy();
    ep.fail(callback);

    ep.after('getValueDone', value.length, function(list){
        callback(null, list);
    });

    value.forEach(function(value){
        findOne(coll, value, pcfg, ep.group('getValueDone'));
    });

}

var checkers = {
    'any': function(value, pcfg, callback){
        callback(null, value);
    },

    'number': function(value, pcfg, callback){
        value = Number(value);
        if(isNaN(value)){
            return callback(pcfg.name + ' must be a number');
        }
        if(('min' in pcfg) && value < pcfg.min){
            return callback(pcfg.name + ' must be less than ' + pcfg.min);
        }
        if(('max' in pcfg) && value > pcfg.max){
            return callback(pcfg.name + ' must be greater than ' + pcfg.max);
        }
        callback(null, value);
    },

    'string': function(value, pcfg, callback){
        if(pcfg.length && value.length !== pcfg.length){
            return callback(pcfg.name + '\'s length must be ' + pcfg.length);
        }
        if(('min' in pcfg) && value < pcfg.min){
            return callback(pcfg.name + ' must be less than ' + pcfg.min);
        }
        if(('max' in pcfg) && value > pcfg.max){
            return callback(pcfg.name + ' must be greater than ' + pcfg.max);
        }
        callback(null ,value);
    },

    'object': function(value, pcfg, callback){
        try{
            value = U.jsonParse(value);
            callback(null, value);
        }catch(e){
            callback(pcfg.name + ' must be an object');
        }
    },

    'file': function(value, pcfg, callback){

        findOne('file', value, pcfg, callback);
    },

    'folder': function(value, pcfg, callback){

        findOne('folder', value, pcfg, callback);
    },

    'fav': function(value, pcfg, callback){

        findOne('fav', value, pcfg, callback);
    },

    'group': function(value, pcfg, callback){

        findOne('group', value, pcfg, callback);
    },

    'message': function(value, pcfg, callback){

        findOne('message', value, pcfg, callback);
    },

    'board': function(value, pcfg, callback){

        findOne('board', value, pcfg, callback);
    },

    'files': function(value, pcfg, callback){

        findArray('file', value, pcfg, callback);
    },

    'folders': function(value, pcfg, callback){

        findArray('folder', value, pcfg, callback);
    },

    'favs': function(value, pcfg, callback){

        findArray('fav', value, pcfg, callback);
    },

    'groups': function(value, pcfg, callback){

        findArray('group', value, pcfg, callback);
    },

    'users': function(value, pcfg, callback){

        findArray('user', value, pcfg, callback);
    }

};


function verifyParam(value, pcfg, parameter, callback){
    var valueHasSet = typeof value !== 'undefined';
    if(!valueHasSet && pcfg.required){
        return callback(pcfg.name + ' is required');
    }
    if(valueHasSet){
        var type = pcfg.type || 'string';
        var checkMethod = checkers[type];
        checkMethod(value, pcfg, function(err, newValue){
            if(err){
                return callback(err, newValue);
            }
            if(pcfg.required){
                if(typeof newValue === 'undefined'){
                    return callback(pcfg.name + '\'s value is null');
                }
                if(us.isArray(newValue) && !newValue.length){
                    return callback(pcfg.name + '\'s length is 0');
                }
            }
            // if(newValue){
            //     newValue.__type = type;
            // }
            parameter[pcfg.name] = newValue;
            callback();
        });
    }else{
        callback();
    }
}

/**
 * 1. 检查参数格式是否正确
 * 2. 检查参数值是否正确, 查询参数所代表的数据是否在数据库中, 
 *     如果有, 则取出来, 存入 parameter 替换掉原来的参数
 */
exports.checkParams = function(req, res, next){
    var path = req.redirectPath || req.path;
    var method = req.method;
    var cfg = ParamConfig[path];
    var parameter = req.parameter = {};

    if(!cfg){
        return next();
    }
    var cfgParams = cfg.params || [];
    
    var ep = new EventProxy();
    ep.fail(function(error, errCode){
        if(errCode === ERR.NOT_FOUND && config.DOWNLOAD_APIS.indexOf(path) > -1){
            console.error(err, errCode);
            // NOTE: 下载接口, 如果找不到文件, 直接跳 404 页面
            return res.redirect(config.NOT_FOUND_PAGE, 404);
        }
        res.json({ err: errCode || ERR.PARAM_ERROR, msg: error });
    });

    if(cfg.method.indexOf(method) === -1){
        return res.json({ err: ERR.NOT_SUPPORT, msg: 'not support method [' + method + ']' });
    }

    ep.after('verifyParamDone', cfgParams.length, function(){
        next();
    });

    cfgParams.forEach(function(pcfg){
        var value = req.param(pcfg.name);
        verifyParam(value, pcfg, parameter, ep.group('verifyParamDone'));
    });

};