var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');

var mFav = require('../models/fav');

exports.create = function(req, res){

    var fildIds = req.body.fileId;
    var creator = req.loginUser._id;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    ep.after('create', fildIds.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    fildIds.forEach(function(fileId){
        mFav.create({ fileId: fileId, creator: creator }, ep.group('create'));
    });

}


exports.delete = function(req, res){

    var favIds = req.body.favId;
    var creator = req.loginUser._id;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: 'delete failure' });
    });

    ep.after('delete', favIds.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    favIds.forEach(function(favId){
        mFav.delete({ favId: favId, creator: creator }, ep.group('delete'));
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
