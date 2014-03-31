var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');
var fs = require('fs');
var path = require('path');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var config = require('../config');

exports.create = function(params, callback){
    
    var doc = {
        path: params.path,
        md5: params.md5,
        size: Number(params.size),
        type: Number(params.type) || 0,
        mimes: params.mimes,
        ref: 0,
        createTime: Date.now(),
        updateTime: Date.now()
    };

    db.resource.insert(doc, function(err, result){
        callback(err, doc);
    });
};

exports.delete = function(query, callback){

    db.resource.findAndRemove(query, [], callback);
};

exports.getResource = function(query, callback){

    db.resource.findOne(query, callback);
};

exports.updateRef = function(resId, value, callback){

    db.resource.findAndModify({ _id: resId }, [],
            { $inc: { ref: value } }, { 'new': true }, function(err, doc){
                
        if(doc && doc.ref <= 0){ // 引用为0了, 删除文件
            console.log('>>>resource ref=0, delete it: ' + doc._id);
            // 还要删除具体文件
            // TODO 生成的 PDF 和 SWF 没有删除
            fs.unlink(path.join(config.FILE_SAVE_ROOT, config.FILE_SAVE_DIR, doc.path), function(err){
                if(err){
                    console.error('>>>delete file: ', err);
                    // callback(err, null);
                }
                
                db.resource.findAndRemove({ _id: doc._id }, [], callback);
                
            });
        }else{
            callback(err, doc);
        }

    });
};

