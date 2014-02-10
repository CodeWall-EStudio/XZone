var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');

exports.create = function(params, callback){
    
    var doc = {
        path: params.path,
        md5: params.md5,
        size: params.size,
        type: Number(params.type) || 0,
        mimes: params.mimes,
        ref: 0,
        createTime: Date.now(),
        updateTime: Date.now()
    }

    db.resource.save(doc, function(err, result){
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
            { $inc: { ref: value } }, { $new: true }, function(err, doc){

        if(doc && doc.ref <= 0){ // 引用为0了, 删除文件
            db.resource.findAndRemove({ _id: doc._id }, [], callback);
        }else{
            callback(err, doc);
        }

    });
}


