// var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
// var EventProxy = require('eventproxy');
// var us = require('underscore');

// var db = require('./db');
// var ERR = require('../errorcode');
// var U = require('../util');


exports.save = function(params, callback){

    var key = params.key;
    var value = params.value;
    var loginUser = params.loginUser;

    db.storage.find({ key: key }, function(err, doc){
        if(err){
            return callback(err);
        }
        if(!doc){
            doc = {
                key: key
            };
        }
        doc.value = value;
        doc.updateTime = Date.now();
        doc.updateUser = new DBRef('user', loginUser._id);

        db.storage.save(doc, function(err){
            callback(err, doc);
        });

    });

};

exports.getConfig = function(query, callback){

    db.storage.find(query, callback);
};
