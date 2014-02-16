var fs = require('fs');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var process = require('child_process');


var db = require('../models/db');
var config = require('../config');
var ERR = require('../errorcode');
var mFile = require('../models/file');
var mRes = require('../models/resource');
var mUser = require('../models/user');
var U = require('../util');



exports.upload = function(req, res){
    var params = req.query;
    var folderId = params.folderId;
    var body = req.body;
    var loginUser = req.loginUser;

    //1. 先把文件保存到 data 目录
    var dir = '/data/71xiaoxue/' + U.formatDate(new Date(), 'yyyy/MM/dd/hhmm/');
    var filename = body.file_md5 + path.extname(body.file_name);
    var folderPath = path.resolve(dir);
    var filePath = path.join(folderPath, filename);

    var name = body.name;
    var fileSize = parseInt(body.file_size);
    var fileType = U.formatFileType(body.file_content_type);

    loginUser.used = Number(loginUser.used);

    var ep = new EventProxy();

    ep.fail(function(err, code){
        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });

    ep.on('moveFile', function(){
        // 添加 resource 记录
        var resource = {
            path: dir + filename,
            md5: body.file_md5,
            size: fileSize,
            mimes: body.file_content_type,
            type: fileType
        }

        mRes.create(resource, ep.done('saveRes'));

        //TODO 未完成  
        //生成 pdf 格式文件
        // if(config.DOC_TYPES.indexOf(resource.mimes) > -1){
        //     process.exec('java -jar ' + config.JOD_CONVERTER + ' ' + resource.path + ' ' + resource.path + '.pdf');
        //     process.exec('pdf2swf ' + resource.path + '.pdf -s flashversion=9 -o ' + resource.path + '.swf');
        // }
        // if(config.PDF_TYPES.indexOf(resource.mimes) > -1){
        //     process.exec('pdf2swf ' + resource.path + '.pdf -s flashversion=9 -o ' + resource.path + '.swf');
        // }
    });
    var savedRes = null;
    ep.on('saveRes', function(resource){
        // 添加文件记录
        var file = {
            creator: loginUser._id,
            folderId: folderId,
            name: name,
            type: fileType,
            size: fileSize,
            resourceId: resource._id.toString()
        }
        resource.ref = 1;
        savedRes = resource;
        mFile.create(file, ep.done('createFile'));
    });

    ep.on('createFile', function(file){
        if(savedRes){
            file.resource = U.filterProp(savedRes, ['_id', 'type', 'size']);
        }
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: file
            }
        })
    });

    ep.on('updateSpaceUsed', function(){
        U.mkdirsSync(folderPath);
        U.moveFile(body.file_path, filePath, ep.done('moveFile'));
    })

    if(loginUser.size < loginUser.used + fileSize){
        ep.emit('error', '空间已经用完', ERR.SPACE_FULL);
    }else{
        // 更新用户size
        loginUser.used = loginUser.used + fileSize;
        var skey = req.cookies.skey;
        req.session[skey] = loginUser; // 更新 session
        mUser.update(loginUser._id, { used: loginUser.used }, ep.done('updateSpaceUsed'));
    }

}

exports.download = function(req, res){
    var fileId = req.query.fileId;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({
            err: ERR.NOT_FOUND,
            msg: 'no such file'
        });
    });

    ep.on('getFile', function(file){
        if(!file){
            ep.emit('error');
        }else{
            mRes.getResource(file.resource.oid.toString(), ep.done('getRes'));
        }
    });

    ep.all('getFile', 'getRes', function(file, resource){
        if(!resource){
            ep.emit('error');
        }else{
            res.set({
                'Content-Type': resource.mimes,
                'Content-Disposition': 'attachment; filename=' + file.name,
                'Content-Length': resource.size,
                'X-Accel-Redirect': '/file/' + resource.path
            });
            res.send();
        }
    });

    mFile.getFile(fileId, ep.done('getFile'));
}

// exports.create = function(req, res){
//     var params = req.query;

//     var loginUser = req.loginUser;

//     params.creator = loginUser._id;
    
//     mFile.create(params, function(err, doc){
//         if(err){
//             res.json({ err: ERR.SERVER_ERROR, msg: err});
//         }else{
//             res.json({
//                 err: ERR.SUCCESS,
//                 result: {
//                     data: doc
//                 }
//             });
//         }
//     });
// }

exports.modify = function(req, res){

    var params = req.body;
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
    var params = req.body;
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

    var params = req.body;
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
        }else if(docs && docs.length){
            db.dereferences(docs, { resource: ['_id', 'type', 'size'] }, function(){
                res.json({
                    err: ERR.SUCCESS,
                    result: {
                        total: total,
                        list: docs
                    }
                });
            });
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
