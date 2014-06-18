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
        parent: params.parentId && new DBRef('department', params.parentId),
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

    db.departuser.findOne({
        'user.$id': params.userId,
        'department.$id': params.organizationId
    }, function(err, result){
        // Logger.debug('[addUser]', result);
        if(result){
            return callback(err, result);
        }
        var doc = {
            user: new DBRef('user', params.userId),
            department: new DBRef('department', params.organizationId)
        };
        db.departuser.save(doc, function(err){
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
            db.user.findOne({ _id: doc.user.oid, test: null, status: 0 }, ep.group('fetchDepartUsers'));

        });

    });

    // 2. 查询该部门的子部门
    db.search('department', { 'parent.$id': dep._id }, { order: { order: 1 } }, ep.doneLater('getDeps'));

    ep.on('getDeps', function(total, deps){
        deps = deps || [];
        dep.children = deps;

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

exports.getOrganizationTree = function(params, callback){

    var ep = new EventProxy();
    ep.fail(callback);

    db.department.findOne({ parent: null }, ep.doneLater('getOrgRoot'));

    ep.on('getOrgRoot', function(root){

        if(!root){
            return callback('can\'t find the root of organization');
        }

        // 查询一级部门
        db.search('department', { 'parent.$id': root._id }, { order: { order: 1 } }, function(err, total, docs){
            if(err){
                return callback(err);
            }
            root.children = docs;

            ep.after('fetchChildDeparts', docs.length, function(){
                callback(null, root);
            });

            docs.forEach(function(doc){
                fetchDepartments(doc, ep.group('fetchChildDeparts'));
            });
            
        });
    });
};