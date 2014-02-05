var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;

var BaseModel = require('./basemodel');

module.exports = exports = new BaseModel('userfolds');

exports.list = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var order = params.order || [];

    var collectionName = groupId ? 'groupfolds' : 'userfolds';
    db.getCollection(collectionName, function(err, collection){

        var query = { pid: new ObjectID(folderId)};
        collection.find(query, { sort: order}).toArray(callback);

    });
}

exports.search = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var keyword = params.keyword || '';

    var order = params.order || [];
    var page = params.page || 1;
    var pageNum = params.pageNum || 0;
    var skipNum = pageNum * (page - 1);

    var collectionName = groupId ? 'groupfolds' : 'userfolds';
    db.getCollection(collectionName, function(err, collection){
        var query = { 
            name: new RegExp('.*' + keyword + '.*'),
            $or: [
                { pid: new ObjectID(folderId) },
                { idpath: new RegExp('\b' + folderId + '\b') }
            ]
        };

        var cursor = collection.find(query);
        var proxy = EventProxy.create('total', 'result', function(total, result){
            callback(null, total || 0, result);
        });
        proxy.fail(callback);

        cursor.count(proxy.done('total'));
        cursor.sort(order).skip(skipNum).limit(pageNum).toArray(proxy.done('result'));

    });
}

exports.getFolder = function(params, callback){
    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var collectionName = groupId ? 'groupfolds' : 'userfolds';

    this.findOne(collectionName, { _id: new ObjectID(folderId) }, callback);

}

exports.modify = function(params, callback){
    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var mark = params.mark;
    var name = params.name;
    var doc = {
        updatetime: Date.now()
    };
    if(params.mark){
        doc.mark = params.mark;
    }
    if(params.name){
        doc.name = params.name;
    }

    var collectionName = groupId ? 'groupfolds' : 'userfolds';

    this.findAndModify(collection, { _id: new ObjectID(folderId) }, doc, callback);
}

exports.create = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;
    var collectionName = groupId ? 'groupfolds' : 'userfolds';
    var hasFolderId = folderId && folderId.length === 24;
    var hasGroupId = groupId && groupId.length === 24;

    var that = this;

    var proxy = EventProxy.create('folder', function(folder){
        var doc = {
            name: params.name,
            creator: params.creator,
            mark: params.mark || '',
            createtime: Date.now(),
            updatetime: Date.now(),
            type: 0,
            pid: null,
            tid: params.tid || null,
            haschild: false
        };
        if(hasGroupId){
            doc.gid = groupId;
            doc.closetime = params.closetime || 0;
        }else{
            doc.prid = params.prid || null;
        }
        if(folder){
            doc.pid = folder._id;
            folder.haschild = true;
            that.save(collectionName, folder, function(err){
                if(err){
                    console.log('models/folder/create', err);
                }
            });
        }
        that.insert(collectionName, doc, function(err, result){
            if(err){
                return proxy.emit('error', err);
            }
            result = result[0];
            if(folder){
                console.log(folder);
                result.idpath = folder.idpath + ',' + result._id;
            }else{
                result.idpath = result._id;
            }

            that.save(collectionName, result, function(err){
                if(err){
                    console.log('models/folder/create', err);
                }
            });
            callback(err, result);
        });

    });

    proxy.fail(callback);

    if(hasFolderId){
        this.findOne(collectionName, { _id: new ObjectID(folderId)}, proxy.done("folder"));
    }else{
        proxy.emit('folder', null);
    }
}
