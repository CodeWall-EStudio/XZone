var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var ERR = require('../errorcode');
var U = require('../util');
var mFile = require('./file');

exports.list = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var order = params.order || [];

    var query = { 'parent.$id': ObjectID(folderId)};

    db.folder.find(query, { sort: order}, function(err, docs){
        if(err){
            callback(err)
        }else{
            db.dereferences(docs, {'creator': ['_id', 'nick']}, callback);
        }
    });

}

exports.search = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || null;
    var userId = params.uid || null;
    var keyword = params.keyword || '';

    var order = params.order || [];
    var page = Number(params.page) || 1;
    var pageNum = Number(params.pageNum) || 0;
    var skipNum = pageNum * (page - 1);

    db.getCollection('folder', function(err, collection){
        var query = { 
            name: new RegExp('.*' + keyword + '.*'),
            $or: [
                { 'parent.$id': new ObjectID(folderId) },
                { idpath: new RegExp('.*' + folderId + '.*') }
            ]
        };
        if(userId){
            query['user.$id'] = ObjectID(userId);
        }
        var cursor = collection.find(query);
        var proxy = EventProxy.create('total', 'result', function(total, result){
            if(total && result){
                db.dereferences(result, {'creator': ['_id', 'nick']}, function(err, result){
                    if(err){
                        callback(err)
                    }else{
                        callback(null, total || 0, result);
                    }
                });
            }else{
                callback(null, total || 0, result);
            }
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

exports.getFolder = function(folderId, callback){

    db.folder.findOne({ _id: new ObjectID(folderId) }, callback);

}

exports.modify = function(params, doc, callback){
    var folderId = params.folderId;
    var groupId = params.groupId;

    doc.updatetime = Date.now();


    db.folder.findAndModify({ _id: new ObjectID(folderId) }, [], { $set: doc }, 
            { 'new':true }, callback);
}

exports.create = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;


    var that = this;

    var proxy = EventProxy.create('folder', function(folder){
        var doc = {
            name: params.name,
            creator: DBRef('user', ObjectID(params.creator)),
            mark: params.mark || '',
            createTime: Date.now(),
            updateTime: Date.now(),
            type: 0,
            parent: null,
            top: params.topId ? DBRef('folder', params.topId) : null,
            hasChild: false
        };
        if(groupId){
            doc.group = DBRef('group', ObjectID(groupId));
            doc.closeTime = params.closeTime || 0;
        }else{
            doc.prepare = params.prepareId ? DBRef('group', ObjectID(params.prepareId)) : null;
        }
        if(folder){
            doc.parent = DBRef('folder', folder._id);
            folder.hasChild = true;
            db.folder.save(folder, function(err){
                if(err){
                    console.log('models/folder/create', err);
                }
            });
        }else{
            doc.parent = doc.top;
        }
        db.folder.insert(doc, function(err, result){
            if(err){
                return proxy.emit('error', err);
            }
            result = result[0];
            if(folder){
                result.idpath = folder.idpath + ',' + result._id;
            }else{
                result.idpath = result._id.toString();
            }

            db.folder.save(result, function(err){
                if(err){
                    console.log('models/folder/create', err);
                }
            });
            callback(err, result);
        });

    });

    proxy.fail(callback);

    if(folderId){
        db.folder.findOne({ _id: new ObjectID(folderId.toString())}, proxy.done("folder"));
    }else{
        proxy.emit('folder', null);
    }
}


exports.delete = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;



    db.folder.findAndRemove({ _id: new ObjectID(folderId)}, [], function(err, folder){
        if(err){
            return callback(err);
        }
        if(!folder){
            return callback('no such folder', ERR.NOT_FOUND);
        }
        if(folder.hasChild){

            var query = { 
                idpath: new RegExp('.*' + folderId + '.*')
            };
            db.folder.find(query, function(err, docs){
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
                proxy.fail(callback);
                docs.forEach(function(doc){

                    mFile.batchDelete({ 'parent.$id': doc._id }, proxy.group('delete'));

                    db.folder.remove({ _id: doc._id }, proxy.group('delete'));
                });
            });
        }
    }); // findAndRemove
}



