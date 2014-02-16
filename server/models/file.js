var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var mRes = require('./resource');


exports.create = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;

    var doc = {
        resource: DBRef('resource', ObjectID(params.resourceId)),
        folder: DBRef('folder', ObjectID(folderId)),
        name: params.name,
        creator: DBRef('user', ObjectID(params.creator)),
        createTime: Date.now(),
        updateTime: Date.now(),
        type: params.type || 0,
        size: params.size || 0,
        content: params.content || '', // 文件说明
        mark: params.mark || '', // 文件评论
        del: false,//是否删除
        isFav: false, // 是否被自己收藏了
        
        status: params.status || 0, // 0 上传 1 分享

        validateText: null,//审核评语
        validateStatus: null, //0 不通过 1 通过
        validateTime: null,//审核时间
        validator: null
    };
    if(groupId){
        doc.group = DBRef('group', ObjectID(groupId));
        doc.fromGroup = params.fromGroup ? DBRef('group', ObjectID(params.fromGroup)) : doc.group;
    }
    // if(params.fromGroup){

    // }

    db.file.insert(doc, function(err, result){
        if(err){
            return callback(err);
        }
        var file = result[0];
        db.folder.findAndModify({ _id: ObjectID(folderId) }, [], 
                { $set: { hasChild: true } }, { 'new':true }, function(err, newFolder){
            
            if(err){
                return callback(err);
            }
            // 将 resource 的引用计数加一
            mRes.updateRef(file.resource.oid.toString(), 1, function(err, newRes){
                if(err){
                    return callback(err);
                }
                callback(null, file);
            });

        });
    });
}

exports.modify = function(fileId, doc, callback){

    doc.updateTime = Date.now();

    db.file.findAndModify({ _id: new ObjectID(fileId) }, [],  { $set: doc }, 
            { 'new':true}, callback);
}

exports.delete = function(fileId, callback){


    db.file.findAndRemove({ _id: new ObjectID(fileId)}, [], function(err, file){

        if(!err){ // 将 resource 的引用计数减一
            
            mRes.updateRef(file.resource.oid.toString(), -1, function(err, newRes){
                callback(null, file);
            });

        }else{
            callback(err);
        }
    });
}

exports.batchDelete = function(query, callback){

    db.file.find(query, function(err, docs){
        if(err || !doc || !docs.length){
            callback(null, 0);
        }else{
            var proxy = new EventProxy();
            proxy.after('delete', docs.length, function(list){
                callback(null, U.calculate(list));
            });
            proxy.fail(callback);
            docs.forEach(function(doc){
                exports.delete(doc._id, proxy.group('delete'));
            });
        }
    });
}

exports.softDelete = function(fileId, callback){

    exports.modify(fileId, { del: true }, callback);

}

exports.revertDelete = function(fileId, callback){
    exports.modify(fileId, { del: false }, callback);
}

exports.getFile = function(fileId, callback){

    db.file.findOne({ _id: ObjectID(fileId) }, callback);

}

exports.search = function(params, callback){
    var folderId = params.folderId;
    var groupId = params.groupId || null;
    // TODO 普通用户不允许搜uid
    var userId = params.uid || null;
    var keyword = params.keyword || '';
    var hasType = 'type' in params;
    var type = Number(params.type) || 0;

    var extendQuery = params.extendQuery || {};

    var query = { 
        name: new RegExp('.*' + keyword + '.*'),
        del: false
    };
    if(folderId){
        query['folder.$id'] = ObjectID(folderId);
    }
    if(userId){
        query['user.$id'] = ObjectID(userId);
    }
    if(hasType){
        query['type'] = type;
    }
    query = us.extend(query, extendQuery);

    db.search('file', query, params, callback);
}

