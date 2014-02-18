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
var mFolder = require('../models/folder');
var mRes = require('../models/resource');
var mUser = require('../models/user');
var mGroup = require('../models/group');
var U = require('../util');



exports.upload = function(req, res){
    var params = req.query;
    var folderId = params.folderId;
    var body = req.body;
    var loginUser = req.loginUser;

    //1. 先把文件保存到 data 目录
    //FIXME 这里的命令太奇怪了, 要fix 它
    var savePath = U.formatDate(new Date(), 'yyyy/MM/dd/hhmm/');

    var filename = body.file_md5 + path.extname(body.file_name);
    var folderPath = path.resolve(path.join(config.FILE_SAVE_DIR, savePath));
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
            path: savePath + filename,
            md5: body.file_md5,
            size: fileSize,
            mimes: body.file_content_type,
            type: fileType
        }

        mRes.create(resource, ep.done('saveRes'));

        //生成 pdf 格式文件
        if(config.DOC_TYPES.indexOf(resource.mimes) > -1){
            process.exec('java -jar ' + config.JOD_CONVERTER + ' ' + filePath + ' ' + filePath + '.pdf', function(err){
                if(!err){
                    process.exec('pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf');
                }
            });
        }
        if(config.PDF_TYPES.indexOf(resource.mimes) > -1){
            process.exec('pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf');
        }
    });

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

        mFile.create(file, ep.done('createFile'));
    });

    ep.all('saveRes', 'createFile', function(savedRes, file){
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
        ep.emit('error', 'Ran out of space', ERR.SPACE_FULL);
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

    // TODO
    // 自己能预览所有和自己相关的文件.包括
    // 收件箱中其他人发过来的邮件,
    // 自己所在的小组中的文件.

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
            var filePath = path.join('/data/71xiaoxue/', resource.path);
            // console.log('redirect to :' + filePath);
            res.set({
                'Content-Type': resource.mimes,
                'Content-Disposition': 'attachment; filename=' + file.name,
                'Content-Length': resource.size,
                'X-Accel-Redirect': filePath
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

exports.share = function(req, res){
    // TODO 分享未完成
    res.json({ err: ERR.SERVER_ERROR, msg: 'api not ready'});
}

exports.modify = function(req, res){

    var params = req.body;
    params.creator = req.loginUser._id;

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
    var params = req.body;
    var fileId = params.fileId;
    var groupId = params.groupId;
    var targetId = params.targetId;

    var ep = new EventProxy();

    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    mFile.getFile(fileId, ep.doneLater('getFile'));

    mFolder.getFolder(targetId, ep.doneLater('getFolder'));

    ep.on('getFile', 'getFolder', function(file, folder){
        if(!file){
            ep.emit('error', 'no such file', ERR.NOT_FOUND);
            return;
        }
        if(!folder){
            ep.emit('error', 'no such target folder', ERR.NOT_FOUND);
            return;
        }
        //  这里需要检查 target 是否是同一个用户或小组的
        if(groupId){
            if(groupId !== file.group.oid.toString()){
                // 传入的 groupId 跟 file 的不一致
                ep.emit('error', 'the groupId not match file.group', ERR.NOT_MATCH);
                return;
            }
            if(groupId !== folder.group.oid.toString()){
                // 目标 folder 不在同一个 group的
                ep.emit('error', 'no auth to access target folder', ERR.NOT_AUTH);
                return;
            }
        }else{
            // 这次操作是个人文件夹操作
            if(file.creator.oid.toString() !== params.creator){
                // , 但是不是同一个用户的目录
                ep.emit('error', 'no auth to access target folder', ERR.NOT_AUTH);
                return;
            }
        }
        // 权限检查没问题
        file.resourceId = file.resource.oid.toString();

        file.groupId = groupId;
        file.folderId  = targetId;
        file.creator = params.creator;
        
        mFile.create(file, ep.done('createFile'));


    });

    ep.on('createFile', function(doc){
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: doc
            }
        });

    });

}

exports.move = function(req, res){
    var params = req.body;
        params.creator = req.loginUser._id;


    var ep = new EventProxy();

    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    mFolder.getFolder(params.targetId, ep.doneLater('getFolder'));

    ep.on('getFolder', function(folder){
        if(!folder){
            ep.emit('error', 'no such target folder', ERR.NOT_FOUND);
            return;
        }
        if(params.groupId){
            // 这次操作是小组操作
            if(folder.group.oid.toString() !== params.groupId){
                // , 但是小组不匹配
                ep.emit('error', 'no auth to access target folder', ERR.NOT_AUTH);
                return;
            }
        }else{
            // 这次操作是个人文件夹操作
            if(folder.creator.oid.toString() !== params.creator){
                // , 但是不是同一个用户的目录
                ep.emit('error', 'no auth to access target folder', ERR.NOT_AUTH);
                return;
            }
        }

        var doc = {
            folder: DBRef('folder', folder._id)
        };

        mFile.modify(params, doc, ep.done('modify'));

    });

    ep.on('modify', function(doc){
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: doc
            }
        });
    });

}

exports.delete = function(req, res){

    var params = req.body;
    var fileId = params.fileId; // TODO 要批量删除
    params.creator = req.loginUser._id;
    // TODO 管理员也能删除
    // 设置删除标志位
    mFile.softDelete(params, function(err, doc){
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
    var folderId = params.folderId;
    var groupId = params.groupId || null;

    params.creator = req.loginUser._id;
    
    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    // 检查文件夹是否是该用户的, 以及 该用户是否是小组成员
    if(groupId){ // 检查该用户是否是小组成员
        mGroup.isGroupMember(groupId, params.creator, ep.doneLater('checkRight'));

    }else{ // 检查该用户是否是该文件夹所有者
        mFolder.isFolderCreator(folderId, params.creator, ep.doneLater('checkRight'));
    }

    ep.on('checkRight', function(hasRight){
        if(!hasRight){
            ep.emit('error', 'not auth to search this folder', ERR.NOT_AUTH);
            return;
        }
        mFile.search(params, ep.done('search'));
    });

    ep.on('search', function(total, docs){
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
}


