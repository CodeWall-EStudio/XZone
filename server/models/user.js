var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var mGroup = require('../models/group');
var mFolder = require('../models/folder');

exports.create = function(params, callback){
    var user = {
        nick: params.nick || '',
        name: params.name || '',
        auth: 0,
        size: params.size || 0,
        used: 0,
        mailnum: 0,
        lastGroup: null
    }
    db.user.save(user, function(err, result){
        if(err){
            return callback(err);
        }
        mFolder.create({
            creator: user._id.toString(),
            name: 'root folder'
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

exports.update = function(docId, doc, callback){

    db.user.findAndModify({ _id: ObjectID(docId) }, [], 
            { $set: doc }, { $new: true }, callback);
}

exports.getUserInfoByName = function(name, callback){
    db.user.findOne({ name: name }, function(err, user){
        if(err){
            callback(err);
        }else if(!user){
            callback('no such user', ERR.NOT_FOUND)
        }else{

            mGroup.getGroupByUser(user._id.toString() , function(err, groups){
                callback(null, user, groups);
            });
        }// end of else 
    });
}


exports.search = function(params, callback){
    var keyword = params.keyword || '';

    var extendQuery = params.extendQuery || {};

    var query = { 
        nick: new RegExp('.*' + keyword + '.*')
    };

    query = us.extend(query, extendQuery);

    db.search('user', query, params, callback);

}
