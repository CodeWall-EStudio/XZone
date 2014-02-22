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
        fromUser: DBRef('user', ObjectID(params.fromUserId)),
        toUser: null,
        content: params.content || '',
        fileName: params.fileName || '',
        type: params.fileType || 0,
        size: params.fileSize || 0,

        resource: DBRef('resource', ObjectID(params.resourceId)),
        // parent: params.parentId ? DBRef('message', ObjectID(params.parentId)) : null,

        // toGroup: null,
        // toFolder: null,

        createTime: Date.now(),
        updateTime: Date.now(),
        saved: false,
        fromUserLooked: false,
        toUserLooked: false
    }

    if(params.toUserId){
        doc.toUser = DBRef('user', ObjectID(params.toUserId));
    }
    if(params.toGroupId){
        doc.toGroup = DBRef('group', ObjectID(params.toGroupId));
    }
    if(params.toFolderId){
        doc.toFolder = DBRef('folder', ObjectID(params.toFolderId));
    }

    db.message.save(doc, function(err, result){

        callback(null, doc);
    });
}

exports.delete = function(msgId, callback){

    db.message.findAndRemove({ _id: new ObjectID(msgId)}, [], callback);
}

exports.modify = function(query, doc, callback){

    db.message.findAndModify(query, [],  { $set: doc }, 
            { 'new':true}, callback);
}

exports.getMessage = function(query, callback){

    db.message.findOne(query, callback);
}

exports.getUnReadNum = function(userId, callback){

    var query = {
        'toUser.$id': ObjectID(userId),
        toUserLooked: false
    }
    db.getCollection('message', function(err, collection){
        
        var cursor = collection.find(query);

        cursor.count(callback);

    });
}

exports.search = function(params, callback){

    var userId = params.creator || null;
    var keyword = params.keyword || '';
    var type = Number(params.type) || 0; // 1: 我的收件箱, 2: 我的发件箱

    var query = {};

    if(keyword){
        query.content = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }

    if(type === 1){
        query['toUser.$id'] = ObjectID(userId);
    }else if(type === 2){
        query['fromUser.$id'] = ObjectID(userId);
    }else if(type === 3){
        query['toUser.$id'] = ObjectID(userId);
        query['toUserLooked'] = false;
    }else{
        callback('params error: type should be 1 , 2 or 3', ERR.PARAM_ERROR);
        return;
    }
    
    db.search('message', query, params, function(err, total, docs){
        if(err){
            callback(err);
        }else if(total && docs){
            var keys = {
                toUser: ['_id', 'nick'], 
                fromUser: ['_id', 'nick'],
                toGroup: ['_id', 'name'],
                resource: ['_id', 'type', 'size']
            };
            db.dereferences(docs, keys, function(err, docs){
                if(err){
                    callback(err)
                }else{
                    callback(null, total || 0, docs);
                }
            });
        }else{
            callback(null, total || 0, docs);
        }
    });

}


