var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var ERR = require('../errorcode');
var U = require('../util');

exports.create = function(params, callback){
    
    var doc = {
        user: DBRef('user', ObjectID(params.creator)),
        resource: DBRef('resource', ObjectID(params.resourceId)),
        remark: params.remark || '',
        createTime: Date.now(),
        type: 0
    }
    if(params.groupId){
        doc.type = 1;
        doc.group = DBRef('group', ObjectID(params.groupId));
    }

    db.fav.save(doc, function(err, result){

        // 将 resource 的引用计数加一
        db.resource.findAndModify({ _id: doc.resource.oid }, [], 
                { $inc: { ref: -1 } }, function(err, newRes){
                    callback(null, doc);
                });
    });
}

exports.delete = function(favId, callback){

    db.fav.findAndRemove({ _id: new ObjectID(favId)}, [], function(err, fav){

        if(!err){ // 将 resource 的引用计数减一
            db.resource.findAndModify({ _id: ObjectID(fav.resource) }, [], 
                    { $inc: { ref: -1 } }, function(err, newRes){
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
    var type = Number(params.type) || 0; // FIXME 按类型分类未实现

    var order = params.order || [];
    var page = Number(params.page) || 1;
    var pageNum = Number(params.pageNum) || 0;
    var skipNum = pageNum * (page - 1);

    var extendQuery = params.extendQuery || {};

    db.getCollection('fav', function(err, collection){
        var query = { 
            name: new RegExp('.*' + keyword + '.*')
        };
        if(userId){
            query['user.$id'] = ObjectID(userId);
        }
        if(groupId){
            query['group.$id'] = ObjectID(groupId);
        }
        query = us.extend(query, extendQuery);

        var cursor = collection.find(query);
        var proxy = EventProxy.create('total', 'result', function(total, result){
            callback(null, total || 0, result);
        });
        proxy.fail(callback);

        cursor.count(proxy.done('total'));
        cursor.sort(order);
        if(skipNum){
            cursor.skip(skipNum);
        }
        if(pageNum){
            cursor.limit(pageNum);
        }
        cursor.toArray(proxy.done('result'));

    });
}
