var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');

var mFav = require('../models/fav');

exports.create = function(req, res){

    var fileIds = req.body.fileId;
    var groupId = req.body.groupId;
    var creator = req.loginUser._id;


    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    ep.after('create', fileIds.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    fileIds.forEach(function(fileId){
        mFav.create({ fileId: fileId, creator: creator, groupId: groupId}, ep.group('create'));
    });

}


exports.delete = function(req, res){

    var fileIds = req.body.fileId;
    var creator = req.loginUser._id;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: 'delete failure' });
    });

    ep.after('delete', fileIds.length, function(list){
        res.json({
            err: ERR.SUCCESS
        });
    });

    fileIds.forEach(function(fileId){
        mFav.delete({ fileId: fileId, creator: creator }, ep.group('delete'));
    });

}



exports.search = function(req, res){
    var params = req.query;
    params.creator = req.loginUser._id;

    mFav.search(params, function(err, total, docs){
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
