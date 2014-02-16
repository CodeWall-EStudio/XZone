var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var db = require('./db');
var mFolder = require('./folder');

exports.create = function(params, callback){
    // 管理员添加的不用审核的
    // 标示小组审核状态 1 审核中 0 已审核
    var status = ('status' in params) ? Number(params.status) : 1;
    if(isNaN(status)){
        status = 1;
    }
    var doc = {
        name: params.name,
        content: params.content || '',
        type: Number(params.type) || 0,
        parent: params.parentId ? DBRef('group', ObjectID(params.parentId)) : null,
        creator: DBRef('user', ObjectID(params.creator)),
        status: status, 
        pt: params.pt || null,
        tag: params.tag || null,
        grade: params.grade || null,

        validateText: null,//审核评语
        validateStatus: null, //0 不通过 1 通过
        validateTime: null,//审核时间
        validator: null
    }

    db.group.save(doc, function(err, result){
        callback(err, doc);
        
    });
}

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

exports.getGroupMembers = function(groupId, needDetail, callback){
    db.groupuser.find({ 'group.$id': ObjectID(groupId)}, function(err, docs){
        if(err){
            return callback(err);
        }
        if(docs && docs.length){
            var ep = new EventProxy();
            ep.after('fetchUser', docs.length, function(list){
                callback(null, list);
            });
            ep.fail(callback);
            docs.forEach(function(doc){
                if(!needDetail){
                    ep.emit('fetchUser', { // FIXME 这里是不是要传个 null 作为第一个参数
                        _id: doc.user.oid
                    });
                }else{
                    db.user.findOne({ _id: doc.user.oid }, 
                            { fields: {_id: 1, nick: 1} }, ep.group('fetchUser'));
                }
            });
        }
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


exports.search = function(params, callback){
    var extendQuery = params.extendQuery || {};

    var query = { };

    query = us.extend(query, extendQuery);  

    db.search('group', query, params, callback);

}



