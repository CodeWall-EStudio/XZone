var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');


exports.create = function(params, callback){

    var ep = new EventProxy();
    ep.fail(callback);

    var updateUserId = params.updateUserId;

    var name = params.name;
    var type = params.type || 0; // 0 个人, 1 小组
    var size = params.size || 0; // 配置的空间大小
    var isDefault = 'isDefault' in params ? params.isDefault : false;

    if(isDefault){
        db.sizegroup.findOne({ type: type, isDefault: true }, function(err, doc){
            if(doc){
                return ep.emit('error', 'already has a default sizegroup with type ' + type);
            }
            ep.emit('ready');
        });
    }else{
        ep.emitLater('ready');
    }

    ep.on('ready', function(){
        var doc = {
            name: name,
            type: type,
            size: size,
            createTime: Date.now(),
            updateTime: Date.now(),
            isDefault: isDefault,
            updateUser: new DBRef('user', updateUserId)
        };

        db.sizegroup.save(doc, function(err){
            if(err){
                return callback(err);
            }
            callback(null, doc);
        });
    });
};

exports.modify = function(query, doc, callback){

    var ep = new EventProxy();
    ep.fail(callback);

    // 更新了 size 时, 要更新所有在这个 sizegroup 的 user 和 group
    doc.updatetime = Date.now();

    // 如果修改了 isDefault 值, 要把原来的default 去掉

    if(doc.isDefault){
        db.sizegroup.update({ isDefault: true, type: query.type }, { $set: { isDefault: false }}, {multi: true},
                function(err){

            if(err){
                return callback(err);
            }
            ep.emit('ready');
        });
    }else{
        ep.emitLater('ready');
    }

    ep.on('ready', function(){
        db.sizegroup.findAndModify(query, [], { $set: doc }, { 'new':true },
                function(err, result){

            if(err){
                return callback(err);
            }
            
            if(doc.size){
                ep.after('updateSize', 2, function(){
                    callback(null, result);
                });

                db.user.update({ 'sizegroup.$id': result._id }, { $set: { size: doc.size } },
                        { multi: true }, ep.group('updateSize'));

                db.group.update({ 'sizegroup.$id': result._id }, { $set: { size: doc.size } },
                        { multi: true }, ep.group('updateSize'));
            }else{
                callback(null, result);
            }
        });
    });

    

};

exports.getSizegroup = function(query, callback){

    db.sizegroup.findOne(query, callback);
};

exports.delete = function(query, callback){

    // 如果有人在用, 就不能删除
    // 不能删除默认空间组
    
    var msg = 'can\'t delete this sizegroup, it\'s using in ';
    var ep = new EventProxy();
    ep.fail(callback);


    db.sizegroup.findOne(query, function(err, result){
        if(!result){
            return ep.emit('ready');
        }
        ep.after('checkUseDone', 2, function(){
            ep.emit('ready');
        });

        db.user.findOne({ 'sizegroup.$id': result._id }, function(err, doc){
            if(doc){
                return callback(msg + 'user: ' + (doc.nick || doc.name), ERR.UNDELETABLE);
            }
            // 不涉及 group 的逻辑, 可以直接用 group.findOne, 否则要用 getGroup 方法获取
            db.group.findOne({ 'sizegroup.$id': result._id }, function(err, doc){
                if(doc){
                    return callback(msg + 'group: ' + doc.name, ERR.UNDELETABLE);
                }
                ep.emit('ready');
            });
        });

    });

    ep.on('ready', function(){
        db.sizegroup.remove(query, callback);
    });
    
};

exports.search = function(params, callback){

    var query = {};
    if(params.keyword){
        query.keyword = params.keyword;
    }

    db.search('sizegroup', query, params, callback);

};
