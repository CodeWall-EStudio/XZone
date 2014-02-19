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

exports.getMessage = function(query, callback){

    db.message.findOne(query, callback);
}

exports.search = function(params, callback){

    var userId = params.creator || null;
    var keyword = params.keyword || '';
    var type = params.type || 0; // 0: 我的收件箱, 1: 我的发件箱, 2:xxx

    var query = {};

    if(keyword){
        query.content = new RegExp('.*' + keyword + '.*');
    }

    if(type === 0){
        query['toUser.$id'] = ObjectID(userId);
    }else if(type === 1){
        query['fromUser.$id'] = ObjectID(userId);
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


