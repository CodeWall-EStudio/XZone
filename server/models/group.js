var db = require('./db');
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;

var mFolder = require('./folder');

function getGroupWithExt(gid, ext, callback){
    db.groups.findOne({ _id: ObjectID(gid) }, function(err, doc){
        if(err){
            return callback(err);
        }
        doc.auth = ext.auth;
        callback(null, doc);
    });
}

exports.getGroupByUser = function(uid, callback){
    db.groupuser.find({ uid: uid }, function(err, docs){
        
        if(err || !docs || !docs.length){
            return callback(err, []);
        }
        var proxy = new EventProxy();
        proxy.after('getGroup', docs.length, function(list){
            callback(null, list);
        });

        proxy.fail(function(err){
            callback(err, 'get user groups error.');
        })
        docs.forEach(function(doc){
            getGroupWithExt(doc.gid, doc, proxy.group('getGroup'));
        });
    });
}

exports.create = function(params, callback){
    var doc = {
        name: params.name,
        type: Number(params.type),
        content: params.content || '',
        pid: params.pid || null,
        creator: params.creator,
        status: true,
        pt: params.pt || null,
        tag: params.tag || null,
        grade: params.grade || null
    }

    db.groups.save(doc, function(err, result){
        
        mFolder.create({ groupId: doc._id.toString() }, function(err, folder){
            if(err){
                callback('create group root folder error');
            }else{
                doc.rootfold = folder._id.toString();

                db.groups.findAndModify({ _id: doc._id }, [],  { $set: {rootfold: doc.rootfold} }, 
                    { 'new':true}, callback)
            }
        });
    });
}