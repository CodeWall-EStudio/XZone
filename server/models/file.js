var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var mRes = require('./resource');
var mUser = require('./user');


exports.create = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;

    var status = ('status' in params) ? Number(params.status)  : 1;
    if(isNaN(status)){
        status = 1;
    }

    var doc = {
        resource: DBRef('resource', ObjectID(params.resourceId)),
        folder: DBRef('folder', ObjectID(folderId)),
        name: params.name,
        creator: DBRef('user', ObjectID(params.creator)),
        createTime: Date.now(),
        updateTime: Date.now(),
        type: Number(params.type) || 0,
        size: Number(params.size) || 0,
        content: params.content || '', // 文件说明
        mark: params.mark || '', // 文件评论
        del: false,//是否删除
        isFav: false, // 是否被自己收藏了
        src: Number(params.src) || 0, // 0 上传 1 分享

        status: status, // 审核状态 1 审核中 0 已审核

        validateText: null,//审核评语
        validateStatus: status === 0 ? 1 : null, //0 不通过 1 通过
        validateTime: null,//审核时间
        validator: null
    };
    if(groupId){
        doc.group = DBRef('group', ObjectID(groupId));
        // doc.fromGroup = params.fromGroup ? DBRef('group', ObjectID(params.fromGroup)) : doc.group;
    }
    // if(params.fromGroup){

    // }

    db.file.insert(doc, function(err, result){
        if(err){
            return callback(err);
        }
        var file = result[0];
        // db.folder.findAndModify({ _id: ObjectID(folderId) }, [], 
        //         { $set: { hasChild: true } }, { 'new':true }, function(err, newFolder){
            
        //     if(err){
        //         return callback(err);
        //     }
            // 将 resource 的引用计数加一
            mRes.updateRef(file.resource.oid.toString(), 1, function(err, newRes){
                if(err){
                    return callback(err);
                }
                callback(null, file);
            });

        // });
    });
}

exports.modify = function(params, doc, callback){

    doc.updateTime = Date.now();

    var query = { _id: new ObjectID(params.fileId) };
    if(params.creator){
        query['creator.$id'] = ObjectID(params.creator);
    }

    db.file.findAndModify(query, [],  { $set: doc }, 
            { 'new':true}, callback);
}

exports.delete = function(params, callback){

    var query = { _id: new ObjectID(params.fileId) };
    if(params.creator){
        query['creator.$id'] = ObjectID(params.creator);
    }
    console.log('>>>delete file:', query);
    var ep = new EventProxy();
    ep.fail(callback);

    db.file.findAndRemove(query, [], ep.doneLater('remove'));

    ep.on('remove', function(file){
        if(file){ 
            // 将 resource 的引用计数减一
            mRes.updateRef(file.resource.oid.toString(), -1, ep.done('updateRef'));

            // 修改用户表的 used 
            mUser.updateUsed(file.creator.oid.toString(),  -1 * (file.size || 0), ep.done('incUsed'))

        }else{
            callback(null);
        }
    });

    ep.all('remove', 'updateRef', 'incUsed', function(file){
        callback(null, file);
    });
}

exports.batchDelete = function(query, callback){
    
    db.file.find(query, function(err, docs){
        if(err || !docs || !docs.length){
            callback(null, 0);
        }else{
            var proxy = new EventProxy();
            proxy.after('delete', docs.length, function(list){
                callback(null, docs.length);
            });
            proxy.fail(callback);
            docs.forEach(function(doc){
                exports.delete({ fileId: doc._id.toString() }, proxy.group('delete'));
            });
        }
    });
}

exports.softDelete = function(params, callback){

    exports.modify(params, { del: true }, callback);

}

exports.revertDelete = function(params, callback){


    exports.modify(params, { del: false }, callback);
}

exports.getFile = function(query, callback){

    db.file.findOne(query, callback);

}

exports.search = function(params, callback){
    var folderId = params.folderId;
    var groupId = params.groupId || null;

    var userId = params.creator || null;

    var keyword = params.keyword || '';

    var type = Number(params.type) || 0;
    var hasType = type !== 0;

    var extendQuery = params.extendQuery;
    var extendDefProps = params.extendDefProps;

    var query = { 
        del: false
    };

    if(keyword){
        query['name'] = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }
    if(folderId){
        query['folder.$id'] = ObjectID(folderId);
    }
    if(userId){
        query['creator.$id'] = ObjectID(userId);
    }
    if(groupId){
        query['group.$id'] = ObjectID(groupId);
    }
    if(hasType){
        query['type'] = type;
    }
    if(extendQuery){
        query = us.extend(query, extendQuery);
    }

    db.search('file', query, params, function(err, total, docs){
        if(err){
            callback(err);
        }else if(total && docs){
            var defProps = { resource: ['_id', 'type', 'size'] };
            if(extendDefProps){
                defProps = us.extend(defProps, extendDefProps);
            }
            db.dereferences(docs, defProps, function(err, docs){
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

