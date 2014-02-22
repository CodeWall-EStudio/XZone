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
    }

    db.resource.insert(doc, function(err, result){
        callback(err, doc);
    });
}

exports.delete = function(resId, callback){

    db.resource.findAndRemove({ _id: new ObjectID(resId)}, [], callback);
}

exports.getResource = function(resId, callback){

    db.resource.findOne({ _id: ObjectID(resId)}, callback);
}

exports.updateRef = function(resId, value, callback){

    db.resource.findAndModify({ _id: ObjectID(resId) }, [], 
            { $inc: { ref: value } }, { 'new': true }, function(err, doc){
                
        if(doc && doc.ref <= 0){ // 引用为0了, 删除文件
            console.log('>>>resource ref=0, delete it: ' + doc._id);
            db.resource.findAndRemove({ _id: doc._id }, [], callback);
            // 还要删除具体文件
            fs.unlink(config.FILE_SAVE_DIR + doc.path);
        }else{
            callback(err, doc);
        }

    });
}

