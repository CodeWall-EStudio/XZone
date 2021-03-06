// var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
// var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var Logger = require('../logger');
var mRes = require('./resource');
var mUser = require('./user');
var mFolder = require('./folder');
var mGroup = require('./group');


exports.create = function(params, callback){
    // var groupId = params.groupId;
    var folderId = params.folderId;

    var status = ('status' in params) ? Number(params.status)  : 1;
    if(isNaN(status)){
        status = 1;
    }

    var doc = {
        resource: new DBRef('resource', params.resourceId),
        folder: new DBRef('folder', folderId),
        name: params.name,
        creator: new DBRef('user', params.creator),
        createTime: Date.now(),
        updateTime: Date.now(),
        type: Number(params.type) || 0,
        size: Number(params.size) || 0,
        content: params.content || '', // 文件说明
        mark: params.mark || '', // 文件评论
        del: false,//是否删除
        isFav: false, // 是否被自己收藏了
        src: Number(params.src) || 0, // 0 上传 1 分享
        isArchive: false, // 是否被归档了

        status: status, // 审核状态 1 审核中 0 已审核

        validateText: null,//审核评语
        validateStatus: status === 0 ? 1 : null, //0 不通过 1 通过
        validateTime: null,//审核时间
        validator: null
    };

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
        mRes.updateRef(file.resource.oid, 1, function(err){
            if(err){
                return callback(err);
            }
            callback(null, file);
        });

        // });
    });
};

exports.modify = function(query, doc, callback){

    doc.updateTime = Date.now();

    db.file.findAndModify(query, [],  { $set: doc },
            { 'new':true}, callback);
};

exports.delete = function(query, params, callback){
    var groupId = params.groupId;

    Logger.info('delete file:', query);

    var ep = new EventProxy();
    ep.fail(callback);

    db.file.findAndRemove(query, [], ep.doneLater('remove'));

    ep.on('remove', function(file){
        if(file){

            // 将 resource 的引用计数减一
            mRes.updateRef(file.resource.oid, -1, ep.done('updateRef'));

            var reduceSize = -1 * (file.size || 0);

            // 是小组的文件就修改小组的 used, 否则才修改 creator的used
            if (!params.updateUsed || (!groupId && !file.creator)) {

                ep.emitLater('incUsed');
            } else if (groupId) {

                // 修改小组的 used
                mGroup.updateUsed(groupId, reduceSize, ep.done('incUsed'));
            } else if (file.creator) {

                // 修改用户表的 used 
                mUser.updateUsed(file.creator,  reduceSize, ep.done('incUsed'));
            }
            
        }else{
            callback(null);
        }
    });

    ep.all('remove', 'updateRef', 'incUsed', function(file){
        callback(null, file);
    });
};

// 删除文件夹的时候, 要区分是个人的目录和小组的目录, 要删除各自的空间大小
exports.batchDelete = function(query, params, callback){
    
    db.file.find(query, function(err, docs){
        if(err || !docs || !docs.length){
            callback(null, 0);
        }else{
            var proxy = new EventProxy();
            proxy.after('delete', docs.length, function(){
                callback(null, docs.length);
            });
            proxy.fail(callback);
            docs.forEach(function(doc){
                exports.delete({ _id: doc._id }, params, proxy.group('delete'));
            });
        }
    });
};


exports.getFile = function(query, callback){

    db.file.findOne(query, callback);

};

exports.countFile = function(query, callback){
    
    db.file.count(query, callback);
};

exports.search = function(params, callback){
    var folderId = params.folderId;
    
    var creator = params.creator || null;

    var keyword = params.keyword || '';

    var type = Number(params.type) || 0;
    var hasType = type !== 0;

    var extendQuery = params.extendQuery;
    var extendDefProps = params.extendDefProps;
    var recursive = params.recursive;

    var isDeref = params.isDeref || false;

    var query = {
        del: false // 默认只能搜索未删除的文件
    };

    if(params.searchAll){
        delete query.del;
    }

    if(keyword){
        query['name'] = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }
    
    if(creator){
        query['creator.$id'] = creator;
    }

    if(hasType){
        query['type'] = type;
    }
    var ep = new EventProxy();
    ep.fail(callback);

    var ids = [];
    
    if(folderId && (recursive || keyword)){
        ids.push(folderId);
        mFolder.search({ folderId: folderId, recursive: true }, ep.doneLater('paramReady'));
    }else if(folderId){
        ids.push(folderId);
        ep.emitLater('paramReady');
    }else{
        ep.emitLater('paramReady');
    }

    ep.on('paramReady', function(total, docs){
        if(docs && docs.length){

            // folder.search 的结果不包含 search 的 folderId 自身
            docs.forEach(function(doc){
                ids.push(doc._id);
            });
        }
        if(ids.length){
            query['folder.$id'] = { $in: ids };
        }

        if(extendQuery){
            query = us.extend(query, extendQuery);
        }

        db.search('file', query, params, function(err, total, docs){
            Logger.debug('mfile/search: ',err, total, isDeref);
            if(err){
                callback(err);
            }else if(total && docs && isDeref){
                // Logger.debug(total, docs, !noDef);
                var defProps = { resource: ['_id', 'type', 'size'] , creator: ['_id', 'nick']};
                if(extendDefProps){
                    defProps = us.extend(defProps, extendDefProps);
                }
                db.dereferences(docs, defProps, function(err, docs){
                    if(err){
                        callback(err);
                    }else{
                        callback(err, total || 0, docs);
                    }
                });
            }else{

                callback(null, total || 0, docs);
            }
        });
    });
};

exports.statistics = function(folderId, options, callback){

    var searchParams = {
        folderId: folderId,
        recursive: true,
        searchAll: true
    };

    if (options.ignoreDel) {
        searchParams.extendQuery = {
            del: false
        };
    }

    exports.search(searchParams, function(err, total, docs){
        if(err){
            return callback(err, total);
        }
        var totalSize = 0;
        var list = {};
        docs.forEach(function(file){
            totalSize += file.size || 0;
            var obj = list[file.type];
            if(!obj){
                list[file.type] = obj = {
                    type: file.type,
                    size: 0,
                    count: 0
                };
            }
            obj.size += file.size || 0;
            obj.count ++;
        });

        var result = {
            totalCount: docs.length,
            totalSize: totalSize,
            list: list
        };
        
        callback(null, result);
    });
};
