var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var mRes = require('./resource');

exports.create = function(params, callback){

    var resourceId = params.resourceId;
    mRes.getResource(resourceId, function(err, resource){
        if(err){
            return callback(err);
        }
        var doc = {
            user: DBRef('user', ObjectID(params.creator)),
            resource: DBRef('resource', ObjectID(resourceId)),
            name: params.name || '',
            remark: params.remark || '',
            createTime: Date.now(),
            type: resource.type,
            size: resource.size
        }
        if(params.groupId){
            doc.group = DBRef('group', ObjectID(params.groupId));
        }

        db.fav.save(doc, function(err, result){

            // 将 resource 的引用计数加一
            mRes.updateRef(resourceId, 1, function(err, newRes){
                if(err){
                    return callback(err);
                }
                callback(null, doc);
            });

        });
    });

}

exports.delete = function(favId, callback){

    db.fav.findAndRemove({ _id: new ObjectID(favId)}, [], function(err, fav){

        if(!err){ // 将 resource 的引用计数减一
            mRes.updateRef(fav.resource.oid.toString(), -1, function(err, newRes){
                // if(err){
                //     return callback(err);
                // }
                callback(null, fav);
            });
        }else{
            callback(err);
        }
    });
}

exports.search = function(params, callback){

    var groupId = params.groupId || null;
    var userId = params.creator || null;
    var keyword = params.keyword || '';
    var hasType = 'type' in params;
    var type = Number(params.type) || 0;

    var extendQuery = params.extendQuery || {};
    var query = { 
        name: new RegExp('.*' + keyword + '.*')
    };
    if(userId){
        query['user.$id'] = ObjectID(userId);
    }
    if(groupId){
        query['group.$id'] = ObjectID(groupId);
    }
    if(hasType){
        query['type'] = type;
    }
    query = us.extend(query, extendQuery);

    db.search('fav', query, params, callback);

}



