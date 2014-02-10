var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var config = require('../config');
var ERR = require('../errorcode');

var mBoard = require('../models/board');

exports.create = function(req, res){
    var params = req.query;

    var loginUser = req.loginUser;

    params.creator = loginUser._id;
    
    mBoard.create(params, function(err, doc){
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

exports.approve = function(req, res){
    var params = req.query;

    var loginUser = req.loginUser;
    
    var doc = {
        status: 0,
        validateText: params.validateText || '',//审核评语
        validateStatus: Number(params.validateStatus) || 0, //0 不通过 1 通过
        validateTime: Date.now(),//审核时间
        validator: DBRef('user', ObjectID(loginUser._id))
    };
    
    mBoard.modify(params.boardId, doc, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS
            });
        }
    });
}

exports.delete = function(req, res){

    var params = req.query;

    mBoard.delete(params.boardId, function(err, doc){
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

    mBoard.search(params, function(err, total, docs){
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
