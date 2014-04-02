var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');

var mFav = require('../models/fav');

exports.create = function(req, res){

    var parameter = req.parameter;
    var files = parameter.fileId;
    var group = parameter.groupId;
    var loginUser = req.loginUser;


    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    ep.after('create', files.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    files.forEach(function(file){
        mFav.create({
            file: file,
            creator: loginUser._id,
            group: group
        }, ep.group('create'));
    });

};


exports.delete = function(req, res){
    var parameter = req.parameter;
    var files = parameter.fileId;
    var loginUser = req.loginUser;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: 'delete failure' });
    });

    ep.after('delete', files.length, function(list){
        res.json({
            err: ERR.SUCCESS
        });
    });

    files.forEach(function(file){
        mFav.delete({
            fileId: file._id,
            creator: loginUser._id
        }, ep.group('delete'));
    });

};



exports.search = function(req, res){
    var params = req.parameter;

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
};
