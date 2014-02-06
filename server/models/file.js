var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var ERR = require('../errorcode');
var U = require('../util');

exports.create = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;

    var collectionName = groupId ? 'groupfile' : 'userfile';

    var doc = {
        docid: params.docId,
        fdid: folderId,
        name: params.name,
        creator: params.creator,
        createtime: Date.now(),
        updatetime: Date.now(),
        content: params.content || '', // 文件说明
        mark: params.mark || '', // 文件评论
        del: false,//是否删除
        tag: null,//审核评语
        rtag: null, //0 通过 1 不通过
        ttime: null//审核时间
    };
    if(groupId){
        doc.gid = groupId;
        doc.fgid = params.fgid || null;
        doc.status = params.status || null; // 0 上传 1 分享
        doc.ruid = params.creator || null;
    }

    db[collectionName].insert(doc, function(err, result){
        if(err){
            return callback(err);
        }
        callback(null, result[0]);
    });
}

exports.modify = function(params, doc, callback){
    var fileId = params.fileId;
    var groupId = params.groupId;

    doc.updatetime = Date.now();

    var collectionName = groupId ? 'groupfile' : 'userfile';
    db[collectionName].findAndModify({ _id: new ObjectID(fileId) }, [],  { $set: doc }, 
            { 'new':true}, callback);
}

exports.delete = function(params, callback){
    var fileId = params.fileId;
    var groupId = params.groupId;

    var collectionName = groupId ? 'groupfile' : 'userfile';

    db[collectionName].findAndRemove({ _id: new ObjectID(fileId)}, [], function(err, file){

        if(!err){ // 将 files 的引用计数减一
            db.files.findAndModify({ _id: ObjectID(file.docid) }, [], { $inc: { ref: -1 } }, function(){});
        }
        callback(err);
    });
}

exports.batchDelete = function(params, query, callback){
    var groupId = params.groupId;

    var collectionName = groupId ? 'groupfile' : 'userfile';
    
    db[collectionName].find(query, function(err, docs){
        if(err || !doc || !docs.length){
            callback(null, 0);
        }else{
            var proxy = new EventProxy();
            proxy.after('delete', docs.length, function(list){
                callback(null, U.calculate(list));
            });
            proxy.fail(callback);
            docs.forEach(function(doc){
                exports.delete({ groupId: groupId, fileId: doc._id }, proxy.group('delete'));
            });
        }
    });
}

exports.getFile = function(params, callback){
    var fileId = params.fileId;
    var groupId = params.groupId;

    var collectionName = groupId ? 'groupfile' : 'userfile';

    db[collectionName].findOne({ _id: ObjectID(fileId) }, callback);

}

exports.search = function(params, callback){
    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var keyword = params.keyword || '';
    var type = Number(params.type) || 0; // FIXME 按类型分类未实现

    var order = params.order || [];
    var page = Number(params.page) || 1;
    var pageNum = Number(params.pageNum) || 0;
    var skipNum = pageNum * (page - 1);

    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfile' : 'userfile';

    db.getCollection(collectionName, function(err, collection){
        var query = { 
            name: new RegExp('.*' + keyword + '.*'),
            fdid: folderId,
            del: false
        };

        var cursor = collection.find(query);
        var proxy = EventProxy.create('total', 'result', function(total, result){
            callback(null, total || 0, result);
        });
        proxy.fail(callback);

        cursor.count(proxy.done('total'));
        cursor.sort(order);
        if(skipNum){
            cursor.skip(skipNum);
        }
        if(pageNum){
            cursor.limit(pageNum);
        }
        cursor.toArray(proxy.done('result'));

    });
}

