var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var mRes = require('./resource');
var mFile = require('./file');

exports.create = function(params, callback){

    var creator = params.creator;
    var file = params.file;
    var group = params.group;

    var resourceId = file.resource.oid;

    mRes.getResource({ _id: resourceId }, function(err, resource){
        if(err){
            return callback(err);
        }
        if(!resource){
            return callback('no such resource', ERR.NOT_FOUND);
        }
        var doc = {
            user: DBRef('user', creator),
            resource: DBRef('resource', resourceId),
            name: params.name || file.name || '',
            remark: params.remark || file.name || '',
            fromFile: DBRef('file', file._id),
            createTime: Date.now(),
            updateTime: Date.now(),
            type: Number(resource.type) || 0,
            size: Number(resource.size) || 0
        };
        if(group){
            doc.fromGroup = DBRef('group', group._id);
        }

        db.fav.save(doc, function(err, result){

            db.file.findAndModify({ _id: file._id }, [],
                    { $set: { isFav: true } }, function(err2){

                callback(err, doc);
            });

            // // 将 resource 的引用计数加一
            // mRes.updateRef(resourceId, 1, function(err, newRes){
            //     if(err){
            //         return callback(err);
            //     }
            //     callback(null, doc);
            // });

        });
    });
};

exports.delete = function(params, callback){
    var fileId = params.fileId;
    var creator = params.creator;

    // 先去掉 file 的收藏状态, 防止 fav 不存在导致的收藏无法取消问题
    db.file.findAndModify({ _id: fileId, 'creator.$id': creator }, [],
            { $set: { isFav: false } }, { 'new':true}, function(err, file){

        console.log('>>>delete fav file: ', file);
        db.fav.findAndRemove({ 'fromFile.$id': fileId, 'user.$id': creator },
                [], callback);
        //         function(err, fav){

        //     if(fav){
        //         console.log('>>>delete fav: ', fav._id);
        //         callback(null);
        //         // 将 resource 的引用计数减一
        //         // mRes.updateRef(fav.resource.oid.toString(), -1, function(err, newRes){
        //         //     callback(null);
        //         // });
        //     }else{
        //         callback(err);
        //     }
        // });

    });

};

exports.search = function(params, callback){

    var creator = params.creator || null;
    var keyword = params.keyword || '';

    var type = Number(params.type) || 0;
    var hasType = type !== 0;

    var extendQuery = params.extendQuery || {};
    var query = {};
    if(keyword){
        query['name'] = new RegExp('.*' + U.encodeRegexp(keyword) + '.*');
    }
    if(creator){
        query['user.$id'] = creator;
    }
    // if(groupId){
    //     query['fromGroup.$id'] = ObjectID(groupId);
    // }
    if(hasType){
        query['type'] = type;
    }
    query = us.extend(query, extendQuery);

    db.search('fav', query, params, callback);

};



