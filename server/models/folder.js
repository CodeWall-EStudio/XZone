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
    var folder = params.folder;
    var isOpen = Number(params.isOpen) || 0;
    var isReadonly = Number(params.isReadonly) || 0;

    var doc = {
        name: params.name,
        creator: DBRef('user', params.creator),
        mark: params.mark || '',
        createTime: Date.now(),
        updateTime: Date.now(),
        type: 0,
        parent: null,
        deletable: ('deletable' in params) ? params.deletable : true,
        isOpen: isOpen === 1, // 0 非公开, 1 公开
        isReadonly: isReadonly === 1, // 0 读写, 1 只读
        top: null,
        hasChild: false
    };
    if(groupId){
        doc.group = DBRef('group', groupId);
        doc.closeTime = Number(params.closeTime) || 0;
    }else{
        doc.prepare = params.prepareId ? DBRef('group', params.prepareId) : null;
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
            return callback(err);
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
};

exports.getFolder = function(query, callback){

    db.folder.findOne(query, callback);

};

exports.modify = function(query, doc, callback){

    doc.updatetime = Date.now();


    db.folder.findAndModify(query, [], { $set: doc },
            { 'new':true }, callback);
};

function deleteFolderAndFiles(folder, callback){
    db.folder.remove({ _id: folder._id }, function(err){
        if(err){
            console.log('>>>folder.delete [folder]', err);
            callback(err);
            return;
        }
        var options = {
            groupId: folder.group && folder.group.oid,
            updateUsed: true
        };

        mFile.batchDelete({ 'folder.$id': folder._id }, options, function(err, count){
                    
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
    var folder = params.folder;

    var ep = new EventProxy();

    ep.fail(callback);

    if(folder.hasChild){

        var query = {
            idpath: new RegExp('.*\\b' + folder._id + '\\b.*')
        };

        db.folder.find(query, ep.done('findAllChild'));
    }else{
        deleteFolderAndFiles(folder, callback);

    }


    ep.on('findAllChild', function(docs){
        if(!docs.length){
            deleteFolderAndFiles(folder, callback);
            return;
        }

        ep.after('delete', docs.length, function(list){
            callback(null, U.calculate(list));
        });

        docs.forEach(function(doc){

            deleteFolderAndFiles(doc, ep.group('delete'));
        });
    });
};


// 废弃, 用 search 代替 (recursive = false)
// 
// exports.list = function(params, callback){

//     var folderId = params.folderId;
//     // var groupId = params.groupId || null;

//     var isDeref = params.isDeref || false;
//     var extendQuery = params.extendQuery;
//     var query = {
//         'parent.$id': folderId
//     };
//     if(params.creator){
//         query['creator.$id'] = params.creator;
//     }
//     if(extendQuery){
//         query = us.extend(query, extendQuery);
//     }

//     db.search('folder', query, { order: params.order }, function(err, total, docs){
//         if(err){
//             callback(err);
//         }else if(total && docs && isDeref){
//             db.dereferences(docs, {'creator': ['_id', 'nick']}, function(err, docs){
//                 if(err){
//                     callback(err);
//                 }else{
//                     callback(null, total || 0, docs);
//                 }
//             });
//         }else{
//             callback(null, total || 0, docs);
//         }
//     });

// };

exports.search = function(params, callback){

    var folderId = params.folderId;
    var groupId = params.groupId || null;
    var creator = params.creator || null;
    var keyword = params.keyword || '';
    var isDeref = params.isDeref || false;
    var recursive = params.recursive || false;
    var extendQuery = params.extendQuery;
    var query = {};

    if(recursive){
        query['$or'] = [
            { 'parent.$id': folderId },
            { idpath: new RegExp('.*\\b' + folderId + '\\b.*') }
        ];
        query['_id'] = { $ne: folderId };
    }else{
        query['parent.$id'] = folderId;
    }

    if(keyword){
        query['name'] = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }
    if(creator){
        query['creator.$id'] = creator;
    }
    if(groupId){
        query['group.$id'] = groupId;
    }
    if(extendQuery){
        query = us.extend(query, extendQuery);
    }
    db.search('folder', query, params, function(err, total, docs){
        if(err){
            callback(err);
        }else if(total && docs && isDeref){
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

exports.statistics = function(folderId, callback){

    var searchParams = {
        folderId: folderId,
        recursive: true
    };
    
    exports.search(searchParams, function(err, total/*, docs*/){
        if(err){
            return callback(err, total);
        }

        callback(null, {
            total: total
        });
        
    });
};
