var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var ERR = require('../errorcode');
var db = require('./db');
var mFolder = require('./folder');

exports.create = function(params, callback){
    // 管理员添加的不用审核的
    // 标示小组审核状态 1 审核中 0 已审核
    var status = ('status' in params) ? Number(params.status) : 1;
    if(isNaN(status)){
        status = 1;
    }

    var ep = new EventProxy();
    ep.fail(callback);

    var nameQuery = {
        name: params.name
    }
    if(params.parentId){
        nameQuery.parent = ObjectID(params.parentId);
    }else{
        nameQuery.parent = null;
    }
    // 小组的名字在同一个group下要唯一
    db.group.findOne(nameQuery, ep.doneLater('findGroup'));

    ep.on('findGroup', function(doc){
        if(doc){
            callback('already has a group naming [' + params.name + '] ', ERR.DUPLICATE);
            return;
        }
        var doc = {
            name: params.name,
            content: params.content || '',
            type: Number(params.type) || 0,
            parent: params.parentId ? DBRef('group', ObjectID(params.parentId)) : null,
            creator: DBRef('user', ObjectID(params.creator)),
            status: status, 
            pt: Number(params.pt) || 0,
            tag: params.tag || null,
            grade: params.grade || null,

            //TODO 小组配额没有加

            validateText: null,//审核评语
            validateStatus: null, //0 不通过 1 通过
            validateTime: null,//审核时间
            validator: null
        }

        db.group.save(doc, ep.done('createGroup'));

    });

    ep.on('createGroup',  function(group){

        mFolder.create({
            creator: params.creator,
            name: 'group root folder',
            groupId: group._id.toString()
        }, ep.done('createFolder'));

    });

    ep.all('createGroup', 'createFolder', function(group, folder){

        group.rootFolder = DBRef('folder', folder._id);

        db.group.findAndModify({ _id: group._id }, [],  { $set: {rootFolder: group.rootFolder } }, 
                    { 'new':true}, callback)

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
            callback(null, us.compact(list));
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
        user: DBRef('user', ObjectID(params.userId)),
        group: DBRef('group', ObjectID(params.groupId)),
        auth: Number(params.auth) || 0
    };
    db.groupuser.save(doc, function(err, result){
        callback(err, doc);
    });
}

exports.removeUserFromGroup = function(params, callback){
    var doc = {
        user: DBRef('user', ObjectID(params.userId)),
        group: DBRef('group', ObjectID(params.groupId))
    };
    db.groupuser.remove(doc, function(err, result){
        callback(err, result);
    });

}
exports.modifyUserAuth = function(params, auth, callback){
    var query = {
        user: DBRef('user', ObjectID(params.userId)),
        group: DBRef('group', ObjectID(params.groupId))
    };
    db.groupuser.update(query, {$set: {auth: Number(params.auth) || 0}}, callback);
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
                    ep.emit('fetchUser', {
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

exports.getGroupMemberIds = function(groupId, callback){

    db.groupuser.find({ 'group.$id': ObjectID(groupId)}, callback);
}

exports.isGroupMember = function(groupId, userId, callback){
    var query = { 
        'group.$id': ObjectID(groupId), 
        'user.$id': ObjectID(userId) 
    };

    db.groupuser.findOne(query, function(err, doc){
        if(doc){
            callback(null, true, doc);
        }else{
            callback(null, false);
        }
    });
}


exports.modify = function(params, doc, callback){

    var nameQuery = {
        name: params.name
    }
    if(params.parentId){
        nameQuery.parent = ObjectID(params.parentId);
    }else{
        nameQuery.parent = null;
    }
    // 小组的名字在同一个group下要唯一
    db.group.findOne(nameQuery, function(err, group){
        if(err){
            callback(err);
        }else if(group){
            callback('name duplicate', ERR.DUPLICATE);
        }else{
            doc.updatetime = Date.now();

            db.group.findAndModify({ _id: new ObjectID(params.groupId) }, [], { $set: doc }, 
                    { 'new':true }, callback);
        }
    });


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



