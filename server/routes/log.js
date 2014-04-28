var EventProxy = require('eventproxy');
var us = require('underscore');

var ERR = require('../errorcode');
var U = require('../util');
var mLog = require('../models/log');

exports.search = function(req, res){
    
    var params = req.parameter;

    mLog.search(params, function(err, total, docs){
        if(err){
            return res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        }
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
};