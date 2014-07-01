var EventProxy = require('eventproxy');
// var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var ERR = require('../errorcode');
var config = require('../config');
var Logger = require('../logger');
var db = require('./db');
var mFolder = require('./folder');

exports.create = function(params, callback){
    // 管理员添加的不用审核的
    // 标示小组审核状态 1 审核中 0 已审核
    var status = ('status' in params) ? Number(params.status) : 1;
    if(isNaN(status)){
        status = 1;
    }
    // type: 0是学校 1是小组 2是部门 3是备课
    var type = ('type' in params) ? Number(params.type) : 1;
    if(isNaN(type)){
        type = 1;
    }

    var ep = new EventProxy();
    ep.fail(callback);

    var doc = {
        name: params.name,
        content: params.content || '',
        type: type,
        parent: params.parentId ? new DBRef('group', params.parentId) : null,
        creator: new DBRef('user', params.creator),
        

        pt: Number(params.pt) || 0,
        tag: params.tag || null,
        grade: params.grade || null,

        startTime: params.startTime || 0,
        endTime: params.endTime || 0,

        sizegroup: params.sizegroupId ? new DBRef('sizegroup', params.sizegroupId) : null,
        size: params.size || config.DEFAULT_USER_SPACE,
        used: 0,

        status: status, // 状态: 0 已审核, 1 审核中, 2 已归档, 3 已关闭, 4 已删除
        archivable: params.archivable || false, // 是否可归档

        order: params.order || 0, // 排序号, 搜索时优先排序

        validateText: null,//审核评语
        validateStatus: status === 0 ? 1 : null, //0 不通过 1 通过
        validateTime: null,//审核时间
        validator: null
    };

    db.group.save(doc, ep.doneLater('createGroup'));


    ep.on('createGroup',  function(group){

        mFolder.create({
            creator: params.creator,
            name: '根目录',
            groupId: group._id
        }, ep.done('createFolder'));

    });

    ep.all('createGroup', 'createFolder', function(group, folder){

        group.rootFolder = new DBRef('folder', folder._id);

        db.group.findAndModify({ _id: group._id }, [],  { $set: {rootFolder: group.rootFolder } },
                    { 'new':true}, callback);

    });
    
};

exports.checkUsed = function(group, fileSize, callback){
    group.used = Number(group.used);
    group.size = Number(group.size);
    if (group.size < group.used + fileSize) {

        callback('Ran out of space', ERR.SPACE_FULL);
    } else {
        
        callback(null);
    }
};

exports.updateUsed = function(groupId, count, callback){
    console.log('>>>updateUsed:', groupId, count);
    db.group.findAndModify({ _id: groupId }, [],
            { $inc: { used: count } }, { 'new': true }, callback);
};

function dereferenceGroup(groupId, ext, callback){
    // 只返回审核通过的
    exports.getGroup({ _id: groupId, validateStatus: 1, status: { $nin: [3, 4] } }, function(err, doc){
        if(err){
            return callback(err);
        }
        if(doc){
            db.dereference(doc, { 'creator': ['nick', '_id'], 'parent': null, 'rootFolder': null }, function(err, result){
                doc.auth = ext.auth;
                // 处理归档逻辑
                exports.archiveCheck(doc, callback);

            });
        }else{
            callback(null, null);
        }
    });
}

exports.getGroupByUser = function(userId, callback){
    db.groupuser.find({ 'user.$id': userId }, function(err, docs){

        if(err || !docs || !docs.length){
            return callback(err, []);
        }
        var proxy = new EventProxy();
        proxy.after('getGroup', docs.length, function(list){
            callback(null, us.compact(list));
        });

        proxy.fail(function(err){
            callback('get user groups error: ' + err);
        });
        docs.forEach(function(doc){
            dereferenceGroup(doc.group.oid, doc, proxy.group('getGroup'));
        });
    });
};

exports.addUserToGroup = function(params, callback){
    var doc = {
        user: new DBRef('user', params.userId),
        group: new DBRef('group', params.groupId),
        auth: Number(params.auth) || 0
    };
    db.groupuser.save(doc, function(err){
        callback(err, doc);
    });
};

exports.removeUserFromGroup = function(params, callback){
    var doc = {
        user: new DBRef('user', params.userId),
        group: new DBRef('group', params.groupId)
    };
    db.groupuser.remove(doc, function(err, result){
        callback(err, result);
    });

};

exports.modifyUserAuth = function(params, callback){
    var query = {
        user: new DBRef('user', params.userId),
        group: new DBRef('group', params.groupId)
    };
    db.groupuser.update(query, {$set: {auth: Number(params.auth) || 0}}, callback);
};

function fetchGroupUser(doc, callback){
    db.user.findOne({ _id: doc.user.oid }, { fields: {_id: 1, nick: 1} },
            function(err, user){

        if(user){
            user.auth = doc.auth;
        }
        callback(err, user);
    });
}

exports.getGroupMembers = function(groupId, needDetail, callback){
    db.groupuser.find({ 'group.$id': groupId}, function(err, docs){
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
                        _id: doc.user.oid,
                        auth: doc.auth
                    });
                }else{
                    fetchGroupUser(doc, ep.group('fetchUser'));
                }
            });
        }else{
            callback(null, []);
        }
    });
};

exports.getGroupMemberIds = function(groupId, callback){

    db.groupuser.find({ 'group.$id': groupId}, callback);
};

exports.getGroupMemberCount = function(groupId, callback){

    db.groupuser.count({ 'group.$id': groupId}, callback);
};

exports.isGroupMember = function(groupId, userId, callback){
    // console.log('>>>isGroupMember', groupId, userId);
    var query = {
        'group.$id': groupId,
        'user.$id': userId
    };
    db.groupuser.findOne(query, function(err, doc){
        if(doc){
            callback(null, true, doc);
        }else{
            callback(null, false);
        }
    });
};

function checkTeacherDepartment(userId, callback){

    db.department.findOne({ 'name': '教学处' }, function(err, doc){
        if(err){
            return callback(err, doc);
        }
        if(!doc){
            return callback(null, false);
        }
        db.departuser.findOne( { 'department.$id': doc._id, 'user.$id': userId }, function(err, doc){
            if(doc){
                return callback(null, true, doc);
            }else{
                return callback(err, doc);
            }
        });
    });
}

exports.isPrepareMember = function(userId, callback){
    // console.log('>>>isPrepareMember', userId);

    // 获取备课小组
    exports.getGroup({ pt: 1 }, function(err, group){
        if(!group){
            Logger.debug('[isPrepareMember] no pt=1 group');
            callback('can not find prepare group', ERR.SERVER_ERROR);
        }else{
            exports.isGroupMember(group._id, userId, function(err, result, doc){
                if(result){
                    callback(err, result, doc);
                }else{
                    // 检查是否是教学处的
                    Logger.debug('[isPrepareMember] check if in teacher department');
                    checkTeacherDepartment(userId, callback);
                }
            });
        }
    });
};



exports.modify = function(query, doc, callback){

    doc.updatetime = Date.now();

    db.group.findAndModify(query, [], { $set: doc },
            { 'new':true }, callback);


};

exports.getGroup = function(query, callback){

    // console.log('>>>getGroup, groupId', groupId, typeof groupId);
    db.group.findOne(query, function(err, group){

        if(group){

            // 处理归档逻辑
            exports.archiveCheck(group, callback);
        }else{
            callback(err, group);
        }
    });
};

exports.archiveCheck = function(group, callback){
    var now = Date.now();
    // Logger.debug('[archiveCheck]', group.archivable, group.type);
    if(group.archivable || group.type === 3){ // 备课组
        Logger.debug(now, group.startTime, group.endTime);
        if( group.status !== 2 && group.startTime && group.endTime && (/*now < group.startTime || */now > group.endTime) ){
            // 超过归档时间, 设置为归档, 不能上传/创建文件夹/复制/移动/删除, 只能看
            group.status = 2; // 2 为归档
            Logger.info('[archiveCheck] update archived group, groupId: ', group._id, ', name: ', group.name );
            exports.modify({ _id: group._id }, { status: group.status }, callback);
            return;
        }
    }
    return callback(null, group);
};

exports.search = function(params, callback){
    var isDeref = params.isDeref || false;

    var extendQuery = params.extendQuery || {};

    var query = { };

    query = us.extend(query, extendQuery);

    db.search('group', query, params, function(err, total, docs){
        if(err){
            callback(err);
        }else if(total && docs && isDeref){
            db.dereferences(docs, {'creator': ['_id', 'nick'], 'sizegroup': null }, function(err, docs){
                if(err){
                    callback(err);
                }else{
                    callback(null, total, docs);
                }
            });
        }else{
            callback(null, total, docs);
        }
    });

};



