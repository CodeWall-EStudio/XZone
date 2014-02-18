var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');
var U = require('../util');
var mBoard = require('../models/board');
var mGroup = require('../models/group');

exports.create = function(req, res){
    var params = req.body;

    var loginUser = req.loginUser;

    params.creator = loginUser._id;
    
    mBoard.create(params, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            doc.creator = {
                _id: loginUser._id,
                nick: loginUser.nick
            }
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
    var params = req.body;

    var loginUser = req.loginUser;
    
    var doc = {
        status: 0,
        validateText: params.validateText || '',//审核评语
        validateStatus: Number(params.validateStatus) || 0, //0 不通过 1 通过
        validateTime: Date.now(),//审核时间
        validator: DBRef('user', ObjectID(loginUser._id))
    };
    
    mBoard.modify({ boardId: params.boardId }, doc, function(err, doc){
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

    var params = req.body;
    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    mBoard.getBoard(params.boardId, ep.doneLater('getBoard'));
    ep.on('getBoard', function(doc){
        if(!doc){
            ep.emit('error', 'no such board', ERR.NOT_FOUND);
            return;
        }
        if(U.hasRight(loginUser.auth, config.AUTH_MANAGER)){
            // 管理员可以直接删
            ep.emit('ready');
        }else{
            mGroup.isGroupMember(doc.group.oid.toString(), loginUser._id, ep.done('checkAuth'));
        }
    });

    ep.on('checkAuth', function(result, doc){
        if(result && U.hasRight(doc.auth, config.AUTH_GROUP_MANAGER)){
            ep.emit('ready');
        }else{
            ep.emit('error', 'not auth', ERR.NOT_AUTH);
        }
    });

    ep.on('ready', function(){
        mBoard.delete(params.boardId, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else{
                res.json({
                    err: ERR.SUCCESS
                });
            }
        });
    });
    
}


exports.search = function(req, res){
    var params = req.query;

    var loginUser = req.loginUser;
    if(loginUser.auth === config.AUTH_USER){
        params.uid = loginUser._id; //普通用户只能搜索自己的
        params.validateStatus = 1; // 普通用户只能搜索审核通过的
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
}
