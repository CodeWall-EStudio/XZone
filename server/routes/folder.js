var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
var ERR = require('../errorcode');

var mGroupFolder = require('../models/groupfolder');
var mUserFolder = require('../models/userfolder');

exports.list = function(req, res){
    var folderId = req.query.folderId;
    var folderType = req.query.folderType;
    var query = { pid: new ObjectID(folderId)};
    var callback = function(err, docs){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: docs
            });
        }
    };
    (folderType === 1 ? mGroupFolder || mUserFolder).find(query, callback);
}

exports.search = function(req, res){
    var folderId = req.query.folderId;
    var folderType = req.query.folderType;
    var query = { pid: new ObjectID(folderId)};
    var callback = function(err, docs){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: docs
            });
        }
    };
    (folderType === 1 ? mGroupFolder || mUserFolder).find(query, callback);
}