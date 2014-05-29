var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');
var EventProxy = require('eventproxy');

var db = require('./db');
var config = require('../config');
var ERR = require('../errorcode');
var mUser = require('../models/user');
var Util = require('../util');
var Logger = require('../logger');

exports.create = function(params, callback) {

    var doc = {
        name: params.name,
        order: params.order || 0,
        parent: new DBRef('department', params.parentId),
        creator: new DBRef('user', params.creator),
        createTime: Date.now(),
        updateTime: Date.now()
    };

    db.department.save(doc, function(err) {
        callback(err, err || doc);
    });

};

exports.modify = function(query, doc, callback) {

    doc.updateTime = Date.now();

    db.department.findAndModify(query, [], {
        $set: doc
    }, {
        'new': true
    }, callback);

};

exports.delete = function(query, callback) {

    Logger.info('[organization] delete: ', query);



    db.department.remove(query, callback);

};

exports.getUsers = function(departmentId, options, callback) {

    var fetchDetail = options.fetchDetail || false;

    db.departuser.find({
        'department.$id': departmentId
    }, function(err, depUsers) {

        if (fetchDetail && depUsers && depUsers.length) {
            ep.after('fetchDepartUsers', depUsers.length, function(list) {
                var users = us.compact(list);

                callback(null, users);
            });

            depUsers.forEach(function(doc) {

                // 过滤掉测试用户
                db.user.findOne({
                    _id: doc.user.oid,
                    test: null,
                    status: 0
                }, ep.group('fetchDepartUsers'));

            });
        } else {
            callback(err, err || depUsers);
        }

    });

};

exports.getChildren = function(departmentId, options, callback) {

    db.department.find({
        'parent.$id': departmentId
    }, callback);

};

exports.addUser = function(params, callback) {

    db.departuser.findOne ({
        'user.$id': params.userId,
        'department.$id': params.organizationId
    }, function(err, result){
        if(result){
            return callback(err, result);
        }
        var doc = {
            user: new DBRef('user', params.userId),
            department: new DBRef('department', params.organizationId)
        };
        db.department.save(doc, function(err){
            callback(err, err || doc);
        });
    });
};

exports.removeUser = function(params, callback) {

    db.departuser.remove({
        'user.$id': params.userId,
        'department.$id': params.organizationId
    }, {
        multi: true
    }, callback);
};