var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var config = require('../config');
var ERR = require('../errorcode');

var mMessage = require('../models/message');

function emptyFunction(){}

function setLookStatus(type, docs){
    var keys = {
        1: 'toUserLooked',
        2: 'fromUserLooked',
        3: 'toUserLooked'
    }
    var doc = {};
    doc[keys[type]] = true;
    docs.forEach(function(msg){
        mMessage.modify({ _id: msg._id }, doc, emptyFunction);
    });
}

exports.search = function(req, res){
    var params = req.query;
    var type = Number(params.type) || 0; // 1: 我的收件箱, 2: 我的发件箱, 3: 通知
    params.creator = req.loginUser._id;

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

            if(docs){
                setLookStatus(type, docs);
            }
        }
    });
}

