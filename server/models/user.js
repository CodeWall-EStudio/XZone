var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');
var EventProxy = require('eventproxy');

var db = require('./db');
var config = require('../config');
var ERR = require('../errorcode');
var mGroup = require('../models/group');
var mFolder = require('../models/folder');
var mMessage = require('../models/message');
var U = require('../util');
var Logger = require('../logger');

exports.create = function(params, callback){

    var ep = new EventProxy();

    ep.fail(callback);

    var user = {
        openid: params.openid,
        nick: params.nick || '',
        name: params.name || '',
        auth: 0,
        status: 0,

        sizegroup: params.sizegroupId ? new DBRef('sizegroup', params.sizegroupId) : null,
        size: params.size || config.DEFAULT_USER_SPACE,
        used: 0,
        mailnum: 0,
        from: params.from,
        lastGroup: null
    };

    if(!user.sizegroup){
        db.sizegroup.findOne({ type: 0, isDefault: true }, function(err, doc){
            ep.emit('sizegroupReady', doc);
        });
    }else{
        ep.emitLater('sizegroupReady', null);
    }

    ep.on('sizegroupReady', function(sizegroup){
        if(sizegroup){
            user.sizegroup = new DBRef('sizegroup', sizegroup._id);
        }

        db.user.save(user, ep.done('saveUser'));
    });

    ep.on('saveUser', function(result){
        mFolder.create({
            creator: user._id,
            name: '根目录'
        }, function(err, folder){
            if(err){
                return callback(err);
            }
            user.rootFolder = new DBRef('folder', folder._id);
            db.user.save(user, function(err, result){
                callback(err, user);
            });
        });
    });

};

exports.getUser = function(query, callback){

    db.user.findOne(query, callback);
};


exports.save = function(user, callback){
    
    db.user.save(user, function(err, result){
        callback(err, user);
    });
};

exports.update = function(query, doc, callback){

    db.user.findAndModify(query, [],
            { $set: doc }, { 'new': true }, callback);
};

exports.checkUsed = function(user, fileSize, callback){
    user.used = Number(user.used);
    user.size = Number(user.size);
    fileSize = fileSize || 0;

    if (user.size < user.used + fileSize) {

        callback('Ran out of space', ERR.SPACE_FULL);
    } else {

        callback(null);
    }
};

exports.updateUsed = function(userId, count, callback){
    count = count || 0;
    
    console.log('>>>updateUsed:', userId, count);
    db.user.findAndModify({ _id: userId }, [],
            { $inc: { used: count } }, { 'new': true }, callback);
};

exports.getUserAllInfo = function(user, callback){
    var userId = user._id;

    var ep = new EventProxy();
    ep.fail(callback);

    // 获取用户参与的小组信息
    mGroup.getGroupByUser(userId , ep.doneLater('getGroupsCb', function(results){
        var groups = [],
            departments = {},
            prepares = [],
            school;

        // 把部门和小组分开
        results.forEach(function(doc){
            if(doc.validateStatus === 0){// 沒通過審核的不返回
                return;
            }
            if(doc.type === 1){
                groups.push(doc);
            }else if(doc.type === 2){
                departments[doc._id.toString()] = doc;
                // departments.push(doc);
            }else if(doc.type === 3){
                prepares.push(doc);
            }else if(doc.type === 0){
                school = doc;
            }
        });

        return {
            groups: groups,
            departments: departments,
            prepares: prepares,
            school: school
        };
    }));


    ep.on('getGroupsCb', function(result){
        var memberDep = result.departments;
        // 读取所有部门
        db.search('group', { type: 2 , validateStatus: { $in: [1, null] }, status: { $nin: [3, 4] } }, {},
                    ep.done('getGroupsCb2', function(total, docs){

            result.departments = [];
            docs.forEach(function(doc){
                var dep = memberDep[doc._id.toString()];
                if(dep){
                    doc.isMember = true;
                    doc.auth = dep.auth || 0;
                }else{
                    doc.isMember = false;
                }
                if(doc.pt === 1 && !(user.__role & config.ROLE_PREPARE_MEMBER)){
                    // 不是备课组的成员, 就不返回这个部门
                    Logger.debug('[getUserAllInfo] current user is not prepare member');
                }else{
                    result.departments.push(doc);
                }
            });
            result.departments.sort(function(a, b){
                return (Number(a.order) || 0) - (Number(b.order) || 0);
            });
            return result;
        }));
    });

    // 获取未读消息数
    mMessage.getUnReadNum(userId, ep.doneLater('getUnReadNumCb'));
    // 获取学校信息
    db.group.findOne({ type: 0 }, ep.doneLater('getSchoolCb'));

    ep.all('getGroupsCb2', 'getUnReadNumCb', 'getSchoolCb',
           function(result, count, school){

        user.mailnum = count || 0;
        //school && (school.auth = 0);
        school && (school.auth = user.auth ? 1 : 0);
        var data = {
            user: user,
            school: school
        };

        if(result){
            data.groups = result.groups;
            data.departments = result.departments;
            data.prepares = result.prepares;
            if(result.school && school){
                school.auth = result.school.auth || 0;
            }
        }
        callback(null, data);
    });
     
};


function fetchDepartments(dep, callback){
    var ep = new EventProxy();
    ep.fail(callback);

    // 1. 先查询该部门的用户
    db.departuser.find({ 'department.$id': dep._id }, ep.doneLater('getUsers'));

    ep.on('getUsers', function(depUsers){

        dep.users = [];

        ep.after('fetchDepartUsers', depUsers.length, function(list){
            dep.users = us.compact(list);

            ep.emit('getUsersDone');
        });

        depUsers.forEach(function(doc){

            // 过滤掉测试用户
            db.user.findOne({ _id: doc.user.oid }, ep.group('fetchDepartUsers'));

        });

    });

    // 2. 查询该部门的子部门
    db.department.find({ 'parent.$id': dep._id }, ep.doneLater('getDeps'));

    ep.on('getDeps', function(deps){
        dep.children = deps || [];

        ep.after('fetchChildDeparts', deps.length, function(){
            ep.emit('getDepartsDone');
        });

        deps.forEach(function(doc){
            fetchDepartments(doc, ep.group('fetchChildDeparts'));
        });

    });

    ep.all('getUsersDone', 'getDepartsDone', function(){

        callback(null, dep);
    });

}

exports.getAllDepartments = function(params, callback){

    var ep = new EventProxy();
    ep.fail(callback);

    db.department.findOne({ parent: null }, ep.doneLater('getSchoolDep'));

    ep.on('getSchoolDep', function(root){

        if(!root){
            return callback('can\'t find the root of departments');
        }

        // 查询一级部门
        db.department.find({ 'parent.$id': root._id }, function(err, docs){
            if(err){
                return ep.emit('error', err);
            }
            root.children = docs;
            console.log('get school');
            ep.after('fetchChildDeparts', docs.length, function(){
                ep.emit('allDone');
            });

            docs.forEach(function(doc){
                fetchDepartments(doc, ep.group('fetchChildDeparts'));
            });
            
        });
    });

    ep.all('getSchoolDep', 'allDone', function(root, allDone){
        if(!allDone){
            callback(null, root);
        }else{
            callback(allDone);
        }
    });
};

exports.search = function(params, callback){
    var keyword = params.keyword || '';

    var extendQuery = params.extendQuery || {};

    var query = {};

    if(keyword){
        var reg = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
        query['$or'] = [
            { 'nick': reg },
            { 'name': reg }
        ];
    }

    query = us.extend(query, extendQuery);

    db.search('user', query, params, callback);

};
