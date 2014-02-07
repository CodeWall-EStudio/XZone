
var config = require('../config');
var ERR = require('../errorcode');

var mFile = require('../models/file');

exports.delete = function(req, res){
    var params = req.query;

    var fileId = params.fileId;
    var groupId = params.groupId;

    mFile.delete(params, function(err){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: 'delete failure' });
        }else{
            res.json({ err: ERR.SUCCESS });
        }
    });
}

exports.revert = function(req, res){

    var params = req.query;

    var fileId = params.fileId;
    var groupId = params.groupId;

    mFile.revertDelete(fileId, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                }
            });
        }
    });
}


exports.search = function(req, res){
    var params = req.query;

    params.extendQuery = {
        del: true
    }

    mFile.search(params, function(err, total, docs){
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
