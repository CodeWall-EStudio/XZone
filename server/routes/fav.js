
var config = require('../config');
var ERR = require('../errorcode');

var mFav = require('../models/fav');

exports.create = function(req, res){

    var params = req.body;
    params.creator = req.loginUser._id;

    mFav.create(params, function(err, doc){
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

    params.creator = req.loginUser._id;

    mFav.delete(params, function(err){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: 'delete failure' });
        }else{
            res.json({ err: ERR.SUCCESS });
        }
    });
}



exports.search = function(req, res){
    var params = req.query;

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
