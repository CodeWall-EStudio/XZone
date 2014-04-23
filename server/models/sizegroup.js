var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');


exports.create = function(params, callback){

    var loginUser = params.loginUser;

    var name = params.name;
    var type = params.type || 0; // 0 个人, 1 小组
    var size = params.size || 0; // 配置的空间大小

    var doc = {
        name: name,
        type: type,
        size: size,
        createTime: Date.now(),
        updateTime: Date.now(),
        updateUser: new DBRef('user', loginUser._id)
    };

    db.sizegroup.save(doc, function(err){
        if(err){
            return callback(err);
        }
        callback(err, doc);
    });
};

exports.modify = function(query, doc, callback){

    doc.updatetime = Date.now();

    // TODO 更新了 size 时, 要更新所有在这个 sizegroup 的 user 和 group
    
    db.sizegroup.findAndModify(query, [], { $set: doc },
            { 'new':true }, callback);

};


exports.delete = function(){
    
};

exports.search = function(query, callback){

    db.sizegroup.find(query, callback);
};
