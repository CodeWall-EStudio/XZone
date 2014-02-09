var db = require('./db');
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;

var mFolder = require('./folder');

function dereferenceGroup(groupId, ext, callback){
    db.group.findOne({ _id: ObjectID(groupId) }, function(err, doc){
        if(err){
            return callback(err);
        }
        if(doc){
            db.dereference(doc, { 'creator': null, 'parent': null, 'rootFolder': null }, function(err, result){
                doc.auth = ext.auth;
                callback(err, doc);
            });
        }else{
            callback(null, null);
        }
    });
}

exports.getGroupByUser = function(uid, callback){
    db.groupuser.find({ 'user.$id': ObjectID(uid) }, function(err, docs){

        if(err || !docs || !docs.length){
            return callback(err, []);
        }
        var proxy = new EventProxy();
        proxy.after('getGroup', docs.length, function(list){
            callback(null, list);
        });

        proxy.fail(function(err){
            callback('get user groups error.');
        });
        docs.forEach(function(doc){

            dereferenceGroup(doc.group.oid.toString(), doc, proxy.group('getGroup'));
        });
    });
}

exports.addUserToGroup = function(params, callback){
    var doc = {
        user: DBRef('user', ObjectID(params.uid)),
        group: DBRef('group', ObjectID(params.groupId)),
        auth: Number(params.auth) || 0
    };
    db.groupuser.save(doc, function(err, result){
        callback(err, doc);
    });

}

exports.create = function(params, callback){
    var doc = {
        name: params.name,
        content: params.content || '',
        type: Number(params.type) || 0,
        parent: params.parentId ? DBRef('group', ObjectID(params.parentId)) : null,
        creator: DBRef('user', ObjectID(params.creator)),
        status: true,
        pt: params.pt || null,
        tag: params.tag || null,
        grade: params.grade || null
    }

    db.group.save(doc, function(err, result){
        callback(err, doc);
        
    });
}

exports.createGroupRootFolder = function(groupId, callback){
    db.group.findOne({ _id: ObjectID(groupId) }, function(err, doc){

        if(err){
            return callback('group "' + groupId + '" is not exist');
        }
        mFolder.create({ groupId: doc._id.toString() }, function(err, folder){
            if(err){
                callback('create group root folder error');
            }else{
                doc.rootFolder = DBRef('folder', folder._id);

                db.group.findAndModify({ _id: doc._id }, [],  { $set: {rootFolder: doc.rootFolder} }, 
                    { 'new':true}, callback)
            }
        });
    });
}

exports.modify = function(groupId, doc, callback){

    doc.updatetime = Date.now();

    db.group.findAndModify({ _id: new ObjectID(groupId) }, [], { $set: doc }, 
            { 'new':true }, callback);

}

exports.getGroup = function(groupId, callback){

    db.group.findOne({ _id: new ObjectID(groupId) }, callback);

}

