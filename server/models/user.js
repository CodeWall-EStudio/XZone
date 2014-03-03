var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');
var EventProxy = require('eventproxy');

var db = require('./db');
var ERR = require('../errorcode');
var mGroup = require('../models/group');
var mFolder = require('../models/folder');
var mMessage = require('../models/message');
var U = require('../util');

exports.create = function(params, callback){
    var user = {
        nick: params.nick || '',
        name: params.name || '',
        auth: 0,
        size: params.size || 0,
        used: 0,
        mailnum: 0,
        from: params.from,
        lastGroup: null
    }
    db.user.save(user, function(err, result){
        if(err){
            return callback(err);
        }
        mFolder.create({
            creator: user._id.toString(),
            name: '根目录'
        }, function(err, folder){
            if(err){
                return callback(err);
            }
            user.rootFolder = DBRef('folder', folder._id.toString());
            db.user.save(user, function(err, result){
                callback(err, user);
            });
        });
    });
}

exports.getUserById = function(id, callback){

    db.user.findOne({ _id: new ObjectID(id)}, callback);
}

exports.getUserByName = function(name, callback){
    db.user.findOne({ name: name }, callback);
}

exports.save = function(user, callback){
    db.user.save(user, function(err, result){
        callback(err, user);
    });
}

exports.update = function(userId, doc, callback){

    db.user.findAndModify({ _id: ObjectID(userId) }, [], 
            { $set: doc }, { 'new': true }, callback);
}

exports.updateUsed = function(userId, count, callback){
    console.log('>>>updateUsed:', userId, count);
    db.user.findAndModify({ _id: ObjectID(userId) }, [], 
            { $inc: { used: count } }, { 'new': true }, callback);
}

exports.getUserAllInfo = function(userId, callback){
    var ep = new EventProxy();
    ep.fail(callback);

    var oid = new ObjectID(userId);
    // 获取用户资料
    db.user.findOne({ _id: oid}, ep.doneLater('getUserCb'));
    // 获取用户参与的小组信息
    mGroup.getGroupByUser(userId , ep.doneLater('getGroupsCb'));
    // 获取未读消息数
    mMessage.getUnReadNum(userId, ep.doneLater('getUnReadNumCb'));
    // 获取学校信息
    db.group.findOne({ type: 0 }, ep.doneLater('getSchoolCb'));

    ep.all('getUserCb', 'getGroupsCb', 'getUnReadNumCb', 'getSchoolCb', 
           function(user, groups, count, school){
        if(!user){
            callback('no such user', ERR.NOT_FOUND);
            return;
        }
        user.mailnum = count;
        var data = {
            user: user,
            groups: groups,
            school: school
        };
        callback(null, data);
    });
     
}


exports.search = function(params, callback){
    var keyword = params.keyword || '';

    var extendQuery = params.extendQuery || {};

    var query = { 
    };

    if(keyword){
        query['nick'] = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }

    query = us.extend(query, extendQuery);

    db.search('user', query, params, callback);

}
