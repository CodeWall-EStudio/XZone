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
        creator: DBRef('user', params.creator),
        parent: params.parentId ? DBRef('board', params.parentId) : null,
        content: params.content || '',

        createTime: Date.now(),
        updateTime: Date.now(),

        resource: params.resourceId ? DBRef('resource', params.resourceId) : null,
        type: 0, //类型 0 个人 1 小组 的文件

        group: DBRef('group', groupId),

        status: 1, // 审核状态 1 审核中 0 已审核

        validateText: null,//审核评语
        validateStatus: null, //0 不通过 1 通过
        validateTime: null,//审核时间
        validator: null
    };

    db.board.save(doc, function(err, result){

        callback(null, doc);
    });
};

exports.modify = function(params, doc, callback){

    var query = {_id: params.boardId };

    db.board.findAndModify(params, [], { $set: doc }, 
            { 'new': true }, callback);

};

exports.delete = function(query, callback){

    db.board.findAndRemove(query, [], callback);
};

exports.search = function(params, callback){

    var creator = params.creator;
    var keyword = params.keyword || '';
    var groupId = params.groupId;
    
    var query = {};

    if(keyword){
        query.content = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }

    if(creator){
        query['creator.$id'] = creator;
    }
    if(groupId){
        query['group.$id'] = groupId;
    }

    if('validateStatus' in params){
        query['validateStatus'] = params.validateStatus;
    }

    db.search('board', query, params, function(err, total, docs){
        if(err){
            callback(err);
        }else if(total && docs){
            db.dereferences(docs, {'creator': ['_id', 'nick']}, function(err, docs){
                if(err){
                    callback(err);
                }else{
                    callback(null, total || 0, docs);
                }
            });
        }else{
            callback(null, total || 0, docs);
        }
    });
};

exports.getBoard = function(query, callback){

    db.board.findOne(query, callback);
};