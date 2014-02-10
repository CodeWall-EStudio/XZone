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
        toUser: DBRef('user', ObjectID(params.toUserId)),
        content: params.content || '',
        resource: DBRef('resource', ObjectID(params.resourceId)),
        parent: params.parentId ? DBRef('message', ObjectID(params.parentId)) : null,

        createTime: Date.now(),
        updateTime: Date.now(),
        saved: false,
        fromUserLooked: false,
        toUserLooked: false
    }

    db.message.save(doc, function(err, result){

        callback(null, doc);
    });
}

exports.delete = function(msgId, callback){

    db.message.findAndRemove({ _id: new ObjectID(msgId)}, [], callback);
}

exports.search = function(params, callback){

    var userId = params.creator || null;
    var keyword = params.keyword || '';

    var query = {};

    if(keyword){
        query.content = new RegExp('.*' + keyword + '.*');
    }

    if(userId){
        query['user.$id'] = ObjectID(userId);
    }

    db.search('message', query, params, callback);

}


