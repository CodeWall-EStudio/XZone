var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
var ERR = require('../errorcode');
var mGroup = require('../models/group');

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

exports.getUserInfoByName = function(name, callback){
    db.user.findOne({ name: name }, function(err, user){
        if(err){
            callback(err);
        }else if(!user){
            callback('no such user', ERR.NOT_FOUND)
        }else{

            mGroup.getGroupByUser(user._id , function(err, groups){
                callback(null, user, groups);
            });
        }// end of else 
    });
}