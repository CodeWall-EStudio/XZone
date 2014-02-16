var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var config = require('../config');
var ERR = require('../errorcode');

var mMessage = require('../models/message');

exports.create = function(req, res){
    var params = req.body;

    var loginUser = req.loginUser;

    params.creator = loginUser._id;
    
    mMessage.create(params, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: doc
                }
            });
        }
    });
}


exports.delete = function(req, res){

    var params = req.body;

    mMessage.delete(params.messageId, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS
            });
        }
    });
}


exports.search = function(req, res){
    var params = req.query;
//TODO 
    mMessage.search(params, function(err, total, docs){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    total: total,
                    list: docs
                }
            });
        }
    });
}
