var fs = require('fs');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');
var mFile = require('../models/file');
var mRes = require('../models/resource');
var U = require('../util');


exports.upload = function(req, res){
    var params = req.query;
    var folderId = params.folderId;
    var body = req.body;
    var loginUser = req.loginUser;

    //1. 先把文件保存到 data 目录
    var dir = '/data/71xiaoxue/' + U.formatDate(new Date(), 'yyyy/MM/dd/hhmm/');
    var folderPath = path.resolve('../' + dir);
    var filePath = path.join(folderPath, body.file_md5 + path.extname(body.file_name));
    var fileName = body.file_name;

    var ep = new EventProxy();

    ep.fail(function(err, code){
        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });

    ep.on('moveFile', function(){
        // 添加 resource 记录
        var resource = {
            path: filePath,
            md5: body.file_md5,
            size: body.file_size,
            mimes: body.file_content_type
        }
        console.log('saveRes');
        mRes.create(resource, ep.done('saveRes'));

    });

    ep.on('saveRes', function(resource){
        // 添加文件记录
        var file = {
            creator: loginUser._id,
            folderId: folderId,
            resourceId: resource._id.toString()
        }
        console.log('createFile');
        mFile.create(file, ep.done('createFile'));
    });

    ep.on('createFile', function(file){
        console.log('json');
        // 更新用户size
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: file
            }
        })
    });

    // TODO 检查空间是否用完
    console.log('mkdirsSync: ',folderPath);
    U.mkdirsSync(folderPath);
    console.log('moveFile');
    U.moveFile(body.file_path, filePath, ep.done('moveFile'));

}

exports.create = function(req, res){
    var params = req.query;

    var loginUser = req.loginUser;

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

    mFile.modify(params.fileId, doc, function(err, doc){
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
    var targetId = params.targetId;

    mFile.getFile(fileId, function(err, file){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
            return;
        }else if(!file){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such file' });
        }else{
            // FIXME 这里需要检查 target 是否是同一个用户或小组的
            delete file._id;
            file.folder = DBRef('folder', ObjectID(targetId));
            // FIXME 还要处理
            db.file.insert(file, function(err, result){
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
        folder: DBRef('folder', ObjectID(params.targetId))
    };
    // FIXME 这里需要检查 target 是否是同一个用户或小组的
    mFile.modify(params.fileId, doc, function(err, doc){
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

    mFile.softDelete(fileId, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS
            });
        }
    });
}


exports.search = function(req, res){
    var params = req.query;


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
