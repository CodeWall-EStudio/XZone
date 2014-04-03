var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');
var U = require('../util');
var mBoard = require('../models/board');
var mGroup = require('../models/group');

exports.create = function(req, res){
    var params = req.parameter;

    var loginUser = req.loginUser;

    params.creator = loginUser._id;
    params.groupId = params.groupId._id;
    if(params.parentId){
        params.parentId = params.parentId._id;
    }
    if(params.resourceId){
        params.resourceId = params.resourceId._id;
    }

    mBoard.create(params, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            doc.creator = {
                _id: loginUser._id,
                nick: loginUser.nick
            };
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: doc
                }
            });
        }
    });
};

exports.approve = function(req, res){
    var params = req.parameter;
    var board = params.boardId;
    var loginUser = req.loginUser;
    
    var doc = {
        status: 0,
        validateText: params.validateText || '',//审核评语
        validateStatus: Number(params.validateStatus) || 0, //0 不通过 1 通过
        validateTime: Date.now(),//审核时间
        validator: DBRef('user', loginUser._id)
    };
    
    mBoard.modify({ boardId: board._id }, doc, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS
            });
        }
    });
};

exports.delete = function(req, res){

    var board = req.parameter.boardId;
    var loginUser = req.loginUser;

    mBoard.delete({ _id: board._id }, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS
            });
        }
    });
    
};


exports.search = function(req, res){
    var params = req.parameter;
    var group = params.groupId;

    var loginUser = req.loginUser;

    params.groupId = group._id;

    if (!group.__editable) {
        // 非管理员, 只能查看审核通过的
        // TODO 暂时不需要审核
        // params.validateStatus = 1;
    }

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
};
