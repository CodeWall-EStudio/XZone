

var config = require('../config');
var ERR = require('../errorcode');

var EventEmitter = require('events').EventEmitter;

var mFolder = require('../models/folder');

exports.list = function(req, res){
    var params = req.query;
    params.creator = req.loginUser._id;
    
    mFolder.list(params, function(err, docs){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    total: docs ? docs.length : 0,
                    list: docs
                }
            });
        }
    });
}

exports.search = function(req, res){
    var params = req.query;

    mFolder.search(params, function(err, total, docs){
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

exports.get = function(req, res){
    var params = req.query;

    mFolder.getFolder(params.folderId, function(err, doc){
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

exports.modify = function(req, res){
    //var params = req.query;
    var params = req.body;
    params.creator = req.loginUser._id;

    var doc = {
    };
    if(params.mark){
        doc.mark = params.mark;
    }
    if(params.name){
        doc.name = params.name;
    }

    mFolder.modify(params, doc, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else if(!doc){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such folder'});
        }else{
            res.json({ err: ERR.SUCCESS , result: { data: doc }});
        }
    });

}

exports.create = function(req, res){
    var loginUser = req.loginUser;

    //var params = req.query;
    var params = req.body;
    
    params.creator = loginUser._id;
    
    mFolder.create(params, function(err, doc){
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

    mFolder.delete(params, function(err, number){
        if(err){
            res.json({ err: number || ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    count: number
                }
            });
        }
    });
}
