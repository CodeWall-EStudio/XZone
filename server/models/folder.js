var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var ERR = require('../errorcode');
var U = require('../util');

exports.list = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var order = params.order || [];

    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfolds' : 'userfolds';
    var query = { pid: folderId};

    db[collectionName].find(query, { sort: order}, callback);

}

exports.search = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var keyword = params.keyword || '';

    var order = params.order || [];
    var page = params.page || 1;
    var pageNum = params.pageNum || 0;
    var skipNum = pageNum * (page - 1);

    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfolds' : 'userfolds';
    db.getCollection(collectionName, function(err, collection){
        var query = { 
            name: new RegExp('.*' + keyword + '.*'),
            $or: [
                { pid: new ObjectID(folderId) },
                { idpath: new RegExp('.*' + folderId + '.*') }
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
    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfolds' : 'userfolds';

    db[collectionName].findOne({ _id: new ObjectID(folderId) }, callback);

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

    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfolds' : 'userfolds';
    db[collectionName].findAndModify({ _id: new ObjectID(folderId) }, [], doc, 
            { 'new':true, upsert:true }, callback);
}

exports.create = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;
    var hasFolderId = folderId && folderId.length === 24;
    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfolds' : 'userfolds';

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
            doc.pid = folder._id.toString();
            folder.haschild = true;
            db[collectionName].save(folder, function(err){
                if(err){
                    console.log('models/folder/create', err);
                }
            });
        }
        db[collectionName].insert(doc, function(err, result){
            if(err){
                return proxy.emit('error', err);
            }
            result = result[0];
            if(folder){
                result.idpath = folder.idpath + ',' + result._id;
            }else{
                result.idpath = result._id.toString();
            }

            db[collectionName].save(result, function(err){
                if(err){
                    console.log('models/folder/create', err);
                }
            });
            callback(err, result);
        });

    });

    proxy.fail(callback);

    if(hasFolderId){
        db[collectionName].findOne({ _id: new ObjectID(folderId)}, proxy.done("folder"));
    }else{
        proxy.emit('folder', null);
    }
}


exports.delete = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;
    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfolds' : 'userfolds';
    var fileCllName = hasGroupId ? 'groupfile' : 'userfile';

    db[collectionName].findAndRemove({ _id: new ObjectID(folderId)}, [], function(err, folder){
        if(err){
            return callback(err);
        }
        if(!folder){
            return callback('no such folder', ERR.NOT_FOUND);
        }
        if(folder.haschild){

            var query = { 
                idpath: new RegExp('.*' + folderId + '.*')
            };
            db[collectionName].find(query, function(err, docs){
                if(err){
                    return callback(err);
                }
                if(!docs.length){
                    return callback(null, 1);
                }
                var proxy = new EventProxy();
                proxy.after('delete', docs.length * 2, function(list){
                    callback(null, U.calculate(list) + 1);
                });
                docs.forEach(function(doc){
                    db[fileCllName].remove( { fid: doc._id.toString() }, proxy.group('delete'));
                    db[collectionName].remove({ _id: doc._id }, proxy.group('delete'));
                });
            });
        }
    }); // db[collectionName]
}



