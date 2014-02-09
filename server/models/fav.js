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
        callback(err, doc);
    });
}

