var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');

var mFile = require('../models/file');

exports.delete = function(req, res){
    var params = req.body;

    var fileIds = params.fileId;
    var groupId = params.groupId;

    var creator = req.loginUser._id;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    ep.after('delete', fileIds.length, function(list){
        res.json({
            err: ERR.SUCCESS
        });
    });

    fileIds.forEach(function(fileId){
        mFile.delete({ 
            fileId: fileId, 
            groupId: groupId
        }, ep.group('delete'));
    });

}

exports.revert = function(req, res){

    var params = req.body;

    var fileIds = params.fileId;
    var groupId = params.groupId;

    var creator = req.loginUser._id;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    ep.after('revert', fileIds.length, function(list){
        res.json({
            err: ERR.SUCCESS
        });
    });

    fileIds.forEach(function(fileId){
        mFile.revertDelete({ 
            fileId: fileId, 
            groupId: groupId
        }, ep.group('revert'));
    });
}


exports.search = function(req, res){
    var params = req.query;

    params.extendQuery = {
        del: true,
    }
    if(!params.groupId){ // TODO 小组的回收站要怎么处理
        params.creator = req.loginUser._id; // 只能搜索自己的回收站
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
