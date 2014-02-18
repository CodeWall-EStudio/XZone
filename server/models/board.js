var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');

exports.create = function(params, callback){
    
    var groupId = params.groupId;

    var doc = {
        creator: DBRef('user', ObjectID(params.creator)),
        parent: params.parentId ? DBRef('board', ObjectID(params.parentId)) : null,
        content: params.content || '',

        createTime: Date.now(),
        updateTime: Date.now(),

        resource: params.resourceId ? DBRef('resource', ObjectID(params.resourceId)) : null,
        type: 0, //类型 0 个人 1 小组 的文件

        group: DBRef('group', ObjectID(groupId)),

        status: 1, // 审核状态 1 审核中 0 已审核

        validateText: null,//审核评语
        validateStatus: null, //0 不通过 1 通过
        validateTime: null,//审核时间
        validator: null
    }

    db.board.save(doc, function(err, result){

        callback(null, doc);
    });
}

exports.modify = function(params, doc, callback){

    var query = {_id: ObjectID(params.boardId)};
    if(params.creator){
        query['creator.$id'] = ObjectID(params.creator);
    }

    db.board.findAndModify(params, [], { $set: doc }, 
            { 'new': true }, callback);

}

exports.delete = function(boardId, callback){

    db.board.findAndRemove({ _id: new ObjectID(boardId)}, [], callback);
}

exports.search = function(params, callback){

    var userId = params.uid || null;
    var keyword = params.keyword || '';

    var query = {};

    if(keyword){
        query.content = new RegExp('.*' + keyword + '.*');
    }

    if(userId){
        query['creator.$id'] = ObjectID(userId);
    }

    if('validateStatus' in params){
        query['validateStatus'] = params.validateStatus;
    }

    db.search('board', query, params, callback);

}

exports.getBoard = function(boardId, callback){
    
    db.board.findOne({ _id: ObjectID(boardId)}, callback);
}