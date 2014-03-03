var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var mFile = require('./file');

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
            deletable: ('deletable' in params) ? params.deletable : true,
            isOpen: params.isOpen === 1, // 0 非公开, 1 公开
            isReadonly: params.isReadonly === 1, // 0 读写, 1 只读
            top: null, 
            hasChild: false
        };
        if(groupId){
            doc.group = DBRef('group', ObjectID(groupId));
            doc.closeTime = Number(params.closeTime) || 0;
        }else{
            doc.prepare = params.prepareId ? DBRef('group', ObjectID(params.prepareId)) : null;
        }
        if(folder){
            doc.parent = DBRef('folder', folder._id);
            doc.top = folder.top || doc.parent;

            folder.hasChild = true;
            db.folder.save(folder, function(err){
                if(err){
                    console.log('models/folder/create', err);
                }
            });
        }else{
            doc.parent = doc.top = null;
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

exports.getFolder = function(query, callback){

    db.folder.findOne(query, function(err, doc){
        if(err || !doc){
            callback(err, doc);
            return;
        }
        db.dereference(doc, {'parent': ['_id', 'name'], 'top': ['_id', 'name']}, callback);
    });

}

exports.modify = function(params, doc, callback){
    var folderId = params.folderId;
    var groupId = params.groupId;
    var creator = params.creator;

    doc.updatetime = Date.now();
    var query = {
        _id: new ObjectID(folderId)
    }

    if(creator){
        query['creator.$id'] = ObjectID(creator);
    }
    if(groupId){
        query['group.$id'] = ObjectID(groupId);
    }

    db.folder.findAndModify(query, [], { $set: doc }, 
            { 'new':true }, callback);
}

function deleteFolderAndFiles(oFolderId, callback){
    db.folder.remove({ _id: oFolderId }, function(err){
        if(err){
            console.log('>>>folder.delete [folder]', err);
            callback(err);
            return;
        }
        mFile.batchDelete({ 'folder.$id': oFolderId }, function(err, count){
            if(err){
                console.log('>>>folder.delete [file]', err);
                callback(err);
                return;
            }
            callback(null, 1 + (count || 0));
        }); 
    });

}

exports.delete = function(params, callback){
    var groupId = params.groupId;
    var folderId = params.folderId;
    var creator = params.creator;

    var query = {
        _id: new ObjectID(folderId)
    }

    if(creator){
        query['creator.$id'] = ObjectID(creator);
    }
    if(groupId){
        query['group.$id'] = ObjectID(groupId);
    }

    var ep = new EventProxy();

    ep.fail(callback);

    db.folder.findOne(query, ep.doneLater('getFolderSucc'));
    ep.on('getFolderSucc', function(folder){
        if(!folder){
            return ep.emit('error', 'no such folder', ERR.NOT_FOUND);
        }
        if(folder.hasChild){

            var query = { 
                idpath: new RegExp('.*' + folderId + '.*')
            };

            db.folder.find(query, ep.done('findAllChild'));
        }else{
            deleteFolderAndFiles(folder._id, callback);

        }
    });


    ep.all('getFolderSucc', 'findAllChild', function(folder, docs){
        if(!docs.length){
            deleteFolderAndFiles(folder._id, callback);
            return;
        }

        ep.after('delete', docs.length, function(list){
            callback(null, U.calculate(list));
        });

        docs.forEach(function(doc){

            deleteFolderAndFiles(doc._id, ep.group('delete'));
        });
    });
}

exports.isFolderCreator = function(folderId, userId, callback){
    var query = { 
        '_id': ObjectID(folderId), 
        'creator.$id': ObjectID(userId) 
    };

    db.folder.findOne(query, function(err, doc){
        if(doc){
            callback(null, true, doc);
        }else{
            callback(null, false);
        }
    });
}

exports.list = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || null;
    var order = null;
    
    var query = { 
        'parent.$id': ObjectID(folderId)
    };
    if(params.creator){
        query['creator.$id'] = ObjectID(params.creator);
    }
    if(params.order){
        order = U.jsonParse(order);
    }

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
    var creator = params.creator || null;
    var keyword = params.keyword || '';

    var query = { 
        $or: [
            { 'parent.$id': new ObjectID(folderId) },
            { idpath: new RegExp('.*' + folderId + '.*') }
        ]
    };
    if(keyword){
        query['name'] = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }
    if(creator){
        query['creator.$id'] = ObjectID(creator);
    }
    if(groupId){
        query['group.$id'] = ObjectID(groupId);
    }
    db.search('folder', query, params, function(err, total, docs){
        if(err){
            callback(err);
        }else if(total && docs){
            db.dereferences(docs, {'creator': ['_id', 'nick']}, function(err, docs){
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
