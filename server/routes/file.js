
var config = require('../config');
var ERR = require('../errorcode');

var mFile = require('../models/file');

exports.create = function(req, res){
    var params = req.query;

    var loginUser = req.loginUser;

    var params = req.query;
    
    params.creator = loginUser._id;
    
    mFile.create(params, function(err, doc){
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

    var params = req.query;
    var doc = {};
    if(params.mark){
        doc.mark = params.mark;
    }
    if(params.name){
        doc.name = params.name;
    }
    if(params.content){
        doc.content = params.content;
    }

    mFile.modify(params, doc, function(err, doc){
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

exports.copy = function(req, res){
    var params = req.query;
    var fileId = params.fileId;
    var groupId = params.groupId;

    var collectionName = groupId ? 'groupfile' : 'userfile';

    mFile.getFile(params, function(err, file){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
            return;
        }else if(!file){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such file' });
        }else{
            // FIXME 这里需要检查 target 是否是同一个用户或小组的
            delete file._id;
            db[collectionName].insert(file, function(err, result){
                if(err){
                    return callback(err);
                }
                callback(null, result[0]);
            });
        }
    });
}

exports.move = function(req, res){
    var params = req.query;
    var doc = {
        fdid: params.targetId
    };
    // FIXME 这里需要检查 target 是否是同一个用户或小组的
    mFile.modify(params, doc, function(err, doc){
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

    var params = req.query;
    // 设置删除标志位
    var fileId = params.fileId;
    var groupId = params.groupId;

    var collectionName = groupId ? 'groupfile' : 'userfile';

    db[collectionName].findAndModify({ _id: ObjectID(fileId) }, [], { $set: { del: true } }, function(err, doc){
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

    var fileId = params.fileId;
    var groupId = params.groupId;

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
