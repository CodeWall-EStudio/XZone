var db = require('./db');
var ObjectID = require('mongodb').ObjectID;

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
