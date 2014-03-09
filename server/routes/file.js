var fs = require('fs');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var process = require('child_process');
var archiver = require('archiver');

var db = require('../models/db');
var config = require('../config');
var ERR = require('../errorcode');
var mFile = require('../models/file');
var mFolder = require('../models/folder');
var mRes = require('../models/resource');
var mUser = require('../models/user');
var mGroup = require('../models/group');
var mMessage = require('../models/message');
var mLog = require('../models/log');
var U = require('../util');
var fileHelper = require('../helper/file_helper');



exports.upload = function(req, res){
    var params = req.query;
    var folderId = params.folderId;

    //TODO 如果这个文件夹关闭了上传, 就不能传了
    var body = req.body;
    var loginUser = req.loginUser;
    var uploadFilePath = body.file_path;

    var ep = new EventProxy();
    ep.fail(function(err, code){
        console.log('>>>file upload error:',{ err: code || ERR.SERVER_ERROR, msg: err });
        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });

    if(!uploadFilePath){
        ep.emit('error', 'upload file fail');
        return;
    }

    fileHelper.hasFolderAccessRight(loginUser._id, folderId, null, ep.doneLater('checkRight'));

    ep.on('checkRight', function(role){
        if(!role){
            return ep.emit('error', 'upload to this folder is not auth', ERR.NOT_AUTH);
        }
        mUser.getUserById(loginUser._id, ep.done('getUser'));
    });

    ep.on('getUser', function(user){
        loginUser = user;
        fileHelper.saveUploadFile({
            folderId: folderId,
            loginUser: loginUser,
            body: body,
            createSWFForDoc: true
        }, ep.done('saveFileSuccess'));
    });

    ep.on('saveFileSuccess', function(file){
        console.log('>>>file upload success:',file._id);
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: file
            }
        })
    });
    

}

function verifyDownload(params, callback){
    var fileId = params.fileId;
    var creator = params.creator;

    var ep = new EventProxy();

    ep.fail(callback);

    mFile.getFile({_id: ObjectID(fileId) }, ep.doneLater('getFile'));

    ep.on('getFile', function(file){
        if(!file){
            ep.emit('error', 'no such file: ' + fileId, ERR.NOT_FOUND);
            return;
        }
        
        mFolder.getFolder({ _id: file.folder.oid }, ep.done('getFolder'));

        mRes.getResource(file.resource.oid.toString(), ep.done('getRes'));

    });

    ep.all('getFile', 'getFolder', 'getRes', function(file, folder, resource){
        if(!resource){
            ep.emit('error', 'no such resource: ' + file.resource.oid, ERR.NOT_FOUND);
            return;
        }

        // 检查权限
        if(file.creator.oid.toString() === creator){
            // 自己的文件, 可以下载
            console.log('download: from self',fileId);
            ep.emit('checkRight', { file: file, resource: resource, folder: folder });
        }else{
            // 检查是否是自己收件箱的文件
            mMessage.getMessage({ 
                'resource.$id': resource._id,
                $or: [
                    { 'fromUser.$id': ObjectID(creator) },
                    { 'toUser.$id': ObjectID(creator) }
                ]
            }, ep.done('getMessage'));
        }
    });

    ep.all('getFile', 'getFolder', 'getRes', 'getMessage', 
            function(file, folder, resource, msg){

        if(msg){ // 是自己收到的, 可以下载
            console.log('download: from in out box',fileId);
            ep.emit('checkRight', { file: file, resource: resource, folder: folder });

        }else if(folder.group){// 检查是否是自己所在小组的
            mGroup.isGroupMember(folder.group.oid.toString(), creator, 
                    ep.done('checkRight', function(hasRight){

                if(hasRight){
                    console.log('download: from group',fileId);
                    return { file: file, resource: resource, folder: folder };
                }
                return null;
            }));
        }else{ // 没有权限
            ep.emit('error', 'not auth to access this file: ' + fileId, ERR.NOT_AUTH);
        }
    })

    ep.on('checkRight', function(data){
        if(data){ // 是自己所在小组的
            callback(null, data);
        }else{
            ep.emit('error', 'not auth to access this file: ' + fileId, ERR.NOT_AUTH);
        }
    });

}

exports.download = function(req, res){
    var fileId = req.query.fileId;
    var loginUser = req.loginUser;
    var creator = loginUser._id;
    
    verifyDownload({
        fileId: fileId,
        creator: creator
    }, function(err, data){
        if(err){
            res.json({ err: data || ERR.SERVER_ERROR, msg: err });
            return;
        }
        var file = data.file, resource = data.resource, folder = data.folder;
        var filePath = path.join(config.FILE_SAVE_DIR, resource.path);
        console.log('redirect to :' + filePath, 'mimes: ' + resource.mimes);
        res.set({
            'Content-Type': resource.mimes,
            'Content-Disposition': 'attachment; filename=' + file.name,
            'Content-Length': resource.size,
            'X-Accel-Redirect': filePath
        });

        res.send();

        mLog.create({
            fromUserId: loginUser._id,
            fromUserName: loginUser.nick,

            fileId: file._id.toString(),
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存
            operateType: 2, 

            srcFolderId: file.folder.oid.toString(),
            // distFolderId: folderId,
            fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            // toGroupId: saveFolder.group || saveFolder.group.oid.toString()
        });
    });
}

exports.batchDownload = function(req, res){
    var fileIds = req.body.fileId;
    var loginUser = req.loginUser;
    var creator = loginUser._id;

    if(!fileIds.length){
        res.json({ err: ERR.PARAM_ERROR, msg: 'no file to download' });
        return;
    }
    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err });
    });
    ep.after('verifyDownload', fileIds.length, function(list){
        var zipName = Math.floor(Math.random() * 1000000) + '.zip';
        var dir = U.formatDate(new Date(), 'yyyy-MM-dd/');
        var zipDir = path.join(config.FILE_SAVE_ROOT, config.FILE_ZIP_DIR, dir);
        var zipPath = path.join(config.FILE_ZIP_DIR, dir, zipName);

        U.mkdirsSync(zipDir);
        var output = fs.createWriteStream(zipDir + zipName);
        var archive = archiver('zip');

        output.on('close', function(){

            res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename=files.zip',
                'Content-Length': archive.pointer(),
                'X-Accel-Redirect': zipPath
            });

            res.send();
        });

        archive.on('error', function(err) {
            ep.emit('error', err);
        });

        archive.pipe(output);

        list.forEach(function(data){

            var file = data.file, resource = data.resource, folder = data.folder;
            var filePath = path.join(config.FILE_SAVE_ROOT, config.FILE_SAVE_DIR, resource.path);
            archive.file(filePath, { name: file.name });

            mLog.create({
                fromUserId: loginUser._id,
                fromUserName: loginUser.nick,

                fileId: file._id.toString(),
                fileName: file.name,

                //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                //6: delete 7: 预览 8: 保存
                operateType: 2, 

                srcFolderId: file.folder.oid.toString(),
                // distFolderId: folderId,
                fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
                // toGroupId: saveFolder.group || saveFolder.group.oid.toString()
            });

        });
        archive.finalize();

    });

    fileIds.forEach(function(fileId){
        verifyDownload({ fileId: fileId, creator: creator }, ep.group('verifyDownload'));
    });

}

exports.preview = function(req, res){
    var fileId = req.query.fileId;
    var loginUser = req.loginUser;
    var creator = loginUser._id;

    //1. 图片, 直接给url
    //2. 文档, 给出swf url
    //3. txt, 给出 text的文本内容
    //4. 音频/视频, 直接给出url

    verifyDownload({
        fileId: fileId,
        creator: creator
    }, function(err, data){
        if(err){
            res.json({ err: data || ERR.SERVER_ERROR, msg: err });
            return;
        }
        var file = data.file, resource = data.resource, folder = data.folder;
        var filePath = path.join(config.FILE_SAVE_DIR, resource.path);

        if(resource.type === 8){//text
            var fileName = path.join(config.FILE_SAVE_ROOT, config.FILE_SAVE_DIR, resource.path);
            fs.readFile(fileName, function(err, data){
                if(!data){
                    res.json({ err: ERR.NOT_FOUND, msg: 'can not find this file' });
                    return;
                }
                res.send(data);
            });

        }else{
            switch(resource.type){
                case 2:// 文档
                    res.set({
                        'Content-Type': 'application/x-shockwave-flash',
                        'X-Accel-Redirect': filePath + '.swf'
                    });
                    res.send();
                    break;
                case 1://image
                case 3://audio
                case 4://video
                case 5://stream

                    res.set({
                        'Content-Type': resource.type,
                        'X-Accel-Redirect': filePath
                    });
                    res.send();
                    break;
                default:
                    res.json({ err: ERR.NOT_SUPPORT, msg: 'not support mimes' });
            }
        }// else
        mLog.create({
            fromUserId: loginUser._id,
            fromUserName: loginUser.nick,

            fileId: file._id.toString(),
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存
            operateType: 7, 

            srcFolderId: file.folder.oid.toString(),
            // distFolderId: folderId,
            fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            // toGroupId: saveFolder.group || saveFolder.group.oid.toString()
        });
    });

}

// 保存收件箱中的文件到自己的目录
exports.save = function(req, res){
    var params = req.body;
    var loginUser = req.loginUser;
    var messageId = params.messageId;
    var rootFolderId = loginUser.rootFolder['$id'];

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    var query = {
        _id: ObjectID(messageId),
        $or: [
            { 'fromUser.$id': ObjectID(loginUser._id) },
            { 'toUser.$id': ObjectID(loginUser._id) }
        ]
    };
    mMessage.getMessage(query, ep.doneLater('getMessage'));

    ep.on('getMessage', function(msg){
        if(!msg){
            ep.emit('error', 'no allow to save', ERR.NOT_AUTH);
            return;
        }
        var param = {
            name: msg.name,
            'folder.$id': ObjectID(rootFolderId)
        };
        console.log('>>>file.save getfile ', param);
        mFile.getFile(param, function(err, file){
            if(file){
                ep.emit('error', 'has the same fileName', ERR.DUPLICATE);
                return;
            }
            mRes.getResource(msg.resource.oid.toString(), ep.done('getResource'));
        });
        
    });

    ep.all('getMessage', 'getResource', function(msg, resource){
        var file = {
            creator: loginUser._id,
            folderId: rootFolderId,
            name: msg.name,
            type: resource.type,
            size: resource.size,
            src: 1, //分享过来的文件
            resourceId: resource._id.toString()
        }

        mFile.create(file, ep.done('createFile'));
        mMessage.modify({ _id: msg._id }, { saved: true }, function(){});
    });

    ep.on('createFile', function(file){
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: file
            }
        });
        mLog.create({
            fromUserId: loginUser._id,
            fromUserName: loginUser.nick,

            fileId: file._id.toString(),
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存
            operateType: 8, 

            // srcFolderId: file.folder.oid.toString(),
            distFolderId: file.folder.oid.toString()
            // fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            // toGroupId: saveFolder.group || saveFolder.group.oid.toString()
        });
    });

}

exports.get = function(req, res){
    var params = req.query;
    var fileId = params.fileId;

    var loginUser = req.loginUser;

    var query = { 
        _id: ObjectID(fileId), 
        'creator.$id': ObjectID(loginUser._id) 
    };
    
    mFile.getFile(query, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else if(!doc){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such file'});
        }else{

            db.dereference(doc, { resource: ['_id', 'type', 'size']}, function(err, resource){

                res.json({
                    err: ERR.SUCCESS,
                    result: {
                        data: doc
                    }
                });
            });

        }
    });
}

function shareToUser(params, callback){
    var fileId = params.fileId;
    var toUserId = params.toUserId;
    var fromUserId = params.fromUserId;

    var content = params.content || '';

    var ep = new EventProxy();
    ep.fail(callback);

    // 1. 先获取文件信息
    mFile.getFile({_id: ObjectID(fileId) }, ep.doneLater('getFile'));
    
    ep.on('getFile', function(file){
        if(!file){
            ep.emit('error', 'no such file', ERR.NOT_FOUND);
            return;
        }
        // 2. 获取资源
        mRes.getResource(file.resource.oid.toString(), ep.done('getResource'));
    });
    ep.all('getFile', 'getResource', function(file, resource){
        if(!resource){
            ep.emit('error', 'no such file', ERR.NOT_FOUND);
            return;
        }
        var msg = {
            content: content,
            toUserId: toUserId,
            fromUserId: fromUserId,
            fileName: file.name,
            fileType: resource.type,
            fileSize: resource.size,

            resourceId: resource._id.toString()
        }
        
        // 创建一条分享消息
        mMessage.create(msg, callback);

        // 记录该操作
        mLog.create({
            fromUserId: fromUserId,

            toUserId: toUserId,

            fileId: file._id.toString(),
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 9,

            srcFolderId: file.folder.oid.toString()
            // distFolderId: file.folder.oid.toString()
            // fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            // toGroupId: saveFolder.group || saveFolder.group.oid.toString()
        });
    });
}

function shareToUsers(params, callback){
    var userIds = params.userIds;
    var ep = new EventProxy();
    ep.fail(callback);
    
    ep.after('shareToUser', userIds.length, function(list){
        callback(null);
    });
    userIds.forEach(function(userId){
        shareToUser({
            fileId: params.fileId,
            toUserId: userId,
            fromUserId: params.creator,
            content: params.content
        }, ep.group('shareToUser'));
    });
}


function shareToGroup(params, callback){
    var fileId = params.fileId;
    var toGroupId = params.toGroupId;
    var toFolderId = params.toFolderId;

    var ep = new EventProxy();
    ep.fail(callback);

    // 1. 先获取文件信息
    mFile.getFile({_id: ObjectID(fileId) }, ep.doneLater('getFile'));
    // 2. 获取小组信息
    mGroup.getGroup(toGroupId, ep.doneLater('getGroup'));

    ep.all('getFile', 'getGroup', function(file, group){
        if(!file){
            ep.emit('error', 'no such file', ERR.NOT_FOUND);
            return;
        }
        if(!group){
            ep.emit('error', 'no such group', ERR.NOT_FOUND);
            return;
        }
        if(!toFolderId){
            toFolderId = group.rootFolder.oid.toString();
        }
        // 拷贝 到目标文件夹

        file.resourceId = file.resource.oid.toString();

        file.groupId = toGroupId;
        file.folderId  = toFolderId;
        file.creator = params.creator;
        file.src = 1; // 分享到小组的文件

        var srcFolderId = file.folder.oid.toString();
        mFile.create(file, callback);

        // 记录该操作
        mLog.create({
            fromUserId: params.creator,

            fileId: fileId,
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 10,

            srcFolderId: srcFolderId,
            distFolderId: toFolderId,
            // fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            toGroupId: toGroupId
        });
    });
    
}

function shareToGroups(params, callback){
    var fileId = params.fileId;
    var groupIds = params.groupIds;
    var folderIds = params.folderIds || [];
    var creator = params.creator;

    var ep = new EventProxy();
    ep.fail(callback);
    
    ep.after('shareToGroup', groupIds.length, function(list){
        callback(null);
    });
    for(var i = 0; i < groupIds.length; i++){
        shareToGroup({
            fileId: fileId,
            toGroupId: groupIds[i],
            toFolderId: folderIds[i],
            creator: creator
        }, ep.group('shareToGroup'));
    }

}

exports.share = function(req, res){

    var params = req.body;
    var loginUser = req.loginUser;
    var fileIds = params.fileId;
    var toUserIds = params.toUserId;
    var toGroupIds = params.toGroupId;
    var toFolderIds = params.toFolderId;
    var content = params.content;

    params.creator = loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    if(!toGroupIds && !toUserIds){
        ep.emit('error', 'must has a share target', ERR.PARAM_ERROR);
        return;
    }else{ 
        ep.after('share', fileIds.length, function(list){
            ep.emit('shareSuccess');
        });

        fileIds.forEach(function(fileId){
            if(toGroupIds){// 共享给多个小组
                shareToGroups({
                    fileId: fileId,
                    groupIds: toGroupIds,
                    folderIds: toFolderIds,
                    creator: loginUser._id
                }, ep.group('share'));
            }else{
                shareToUsers({// 共享给多个人
                    fileId: fileId,
                    userIds: toUserIds,
                    content: content,
                    creator: loginUser._id
                }, ep.group('share'));
            }
        });

    }

    ep.on('shareSuccess', function(){
        res.json({
            err: ERR.SUCCESS
        });
    });

}

function modifyFile(params, callback){
    var fileId = params.fileId;

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

    var ep = new EventProxy();
    ep.fail(callback);

    mFile.getFile({
        _id: ObjectID(fileId)
    }, ep.doneLater('getFile'));

    ep.on('getFile', function(file){
        if(!file){
            ep.emit('error', 'no such file', ERR.NOT_FOUND);
            return;
        }
        if(params.name){
            mFile.getFile({
                name: params.name,
                'folder.$id': file.folder.oid
            }, function(err, file){
                if(file){
                    ep.emit('checkName', false);
                }else{
                    ep.emit('checkName', true);
                }
            });
        }else{
            ep.emit('checkName', true);
        }

    });

    ep.all('getFile', 'checkName', function(file, result){
        if(!result){
            ep.emit('error', 'has the same fileName in this folder', ERR.DUPLICATE);
            return;
        }
        var oldFileName = file.name;
        mFile.modify(params, doc, callback);

        // 记录该操作
        mLog.create({
            fromUserId: params.creator,

            fileId: file._id.toString(),
            fileName: oldFileName,
            newFileName: params.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 5,

            srcFolderId: file.folder.oid.toString()
            // distFolderId: toFolderId,
            // fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            // toGroupId: toGroupId
        });
            
    });
}

exports.modify = function(req, res){

    var params = req.body;

    params.creator = req.loginUser._id;

    modifyFile(params, function(err, file){
        if(err){
            res.json({ err: file || ERR.SERVER_ERROR, msg: err});
            return;
        }
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: file
            }
        });
        
    });


}

function copyFile(params, callback){
    var fileId = params.fileId;
    var groupId = params.groupId;
    var targetId = params.targetId;

    var ep = new EventProxy();

    ep.fail(callback);

    mFile.getFile({_id: ObjectID(fileId) }, ep.doneLater('getFile'));

    ep.on('getFile', function(file){
        if(!file){
            return ep.emit('error', 'no such file', ERR.NOT_FOUND);
        }
        // 检查是否有源目录的访问权限
        fileHelper.hasFolderAccessRight(params.creator, file.folder.oid.toString(), groupId, ep.done('checkSourceFolderRight'));
        // 检查是否有目标目录的访问权限
        fileHelper.hasFolderAccessRight(params.creator, targetId, null, ep.done('checkTargetFolderRight'));

    });

    ep.all('getFile', 'checkSourceFolderRight', 'checkTargetFolderRight', function(file, srcRole, dstRole){
        if(!srcRole){
            return ep.emit('error', 'no auth to access the srouce file', ERR.NOT_AUTH);
        }
        if(!dstRole){
            return ep.emit('error', 'no auth to access the target folder', ERR.NOT_AUTH);
        }
        
        mFile.getFile({ // 重名检查
            name: file.name,
            'folder.$id': ObjectID(targetId)
        }, function(err, file){
            if(file){
                ep.emit('checkName', false);
            }else{
                ep.emit('checkName', true);
            }
        });
    });

    ep.all('getFile', 'checkName', function(file, bool){
        if(bool){
            return ep.emit('error', 'file name duplicate', ERR.DUPLICATE);
        }
        // 权限检查没问题
        file.resourceId = file.resource.oid.toString();

        file.groupId = groupId;
        file.folderId  = targetId;
        file.creator = params.creator;
        
        mFile.create(file, callback);
        // 记录该操作
        mLog.create({
            fromUserId: params.creator,

            fileId: file._id.toString(),
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 3,

            srcFolderId: file.folder.oid.toString()
            distFolderId: targetId,
            // fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            // toGroupId: toGroupId
        });

    });


}

exports.copy = function(req, res){
    var params = req.body;
    var fileIds = params.fileId;
    var groupId = params.groupId;
    var targetId = params.targetId;

    var creator = req.loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('copy', fileIds.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    fileIds.forEach(function(fileId){
        copyFile({
            fileId: fileId,
            creator: creator,
            targetId: targetId,
            groupId: groupId

        }, ep.group('copy'));
    });

}

function moveFile(params, callback){
    var ep = new EventProxy();

    ep.fail(callback);

    mFile.getFile({ _id: ObjectID(params.fileId) }, ep.doneLater('getFile'));

    mFolder.getFolder({ _id: ObjectID(params.targetId) }, ep.doneLater('getFolder'));

    ep.all('getFile', 'getFolder', function(file, folder){
        if(!file){
            ep.emit('error', 'no such file', ERR.NOT_FOUND);
            return;
        }
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

        mFile.getFile({ // 重名检查
            name: file.name,
            'folder.$id': ObjectID(targetId)
        }, function(err, file){
            if(file){
                ep.emit('checkName', false);
            }else{
                ep.emit('checkName', true);
            }
        });
    });

    ep.all('getFile', 'getFolder', 'checkName', function(file, folder, bool){
        if(bool){
            return ep.emit('error', 'file name duplicate', ERR.DUPLICATE);
        }

        var doc = {
            folder: DBRef('folder', folder._id)
        };

        mFile.modify(params, doc, callback);

        // 记录该操作
        mLog.create({
            fromUserId: params.creator,

            fileId: file._id.toString(),
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 4,

            srcFolderId: file.folder.oid.toString(),
            distFolderId: params.targetId,
            fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
            // toGroupId: toGroupId
        });
    });
}

exports.move = function(req, res){
    var params = req.body;

    var fileIds = params.fileId;
    var groupId = params.groupId;
    var targetId = params.targetId;

    var creator = req.loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('move', fileIds.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    fileIds.forEach(function(fileId){
        moveFile({
            fileId: fileId,
            creator: creator,
            targetId: targetId,
            groupId: groupId

        }, ep.group('move'));
    });

}


exports.delete = function(req, res){

    var params = req.body;
    var fileIds = params.fileId; 
    var loginUser = req.loginUser;
    var creator = loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('delete', fileIds.length, function(list){
        res.json({
            err: ERR.SUCCESS
        });
    });

    fileIds.forEach(function(fileId){
        // 设置删除标志位
        mFile.softDelete({
            fileId: fileId,
            creator: creator
        }, ep.group('delete', function(file){
            if(file){
                // 记录该操作
                mLog.create({
                    fromUserId: loginUser._id,
                    fromUserName: loginUser.nick,

                    fileId: file._id.toString(),
                    fileName: file.name,

                    //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                    //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 11: delete(移动到回收站)
                    operateType: 11,

                    srcFolderId: file.folder.oid.toString()
                    // distFolderId: params.targetId,
                    // fromGroupId: folder ? folder.group && folder.group.oid.toString() : null
                    // toGroupId: toGroupId
                });
            }
            
            return file;
        }));
        
    });

}


exports.search = function(req, res){
    var params = req.query;
    var folderId = params.folderId;
    var groupId = params.groupId;
    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    // 检查权限
    fileHelper.hasFolderAccessRight(loginUser._id, folderId, groupId, ep.doneLater('checkRight'));

    ep.on('checkRight', function(role){
        if(!role){
            ep.emit('error', 'not auth to search this folder', ERR.NOT_AUTH);
            return;
        }
        if(role === 'creator'){
            params.creator = loginUser._id;
        }else if(role === 'school'){
            params.extendQuery = {};
            if(('status' in params) && U.hasRight(loginUser.auth, config.AUTH_MANAGER)){
                // status 参数只对管理员生效
                params.extendQuery.status = Number(params.status) || 0;
            }else{
                params.extendQuery.validateStatus = 1// 学校空间只能看审核通过的文件
            }
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

exports.query = function(req, res){
    var params = req.query;
    var cate = Number(params.cate);
    var creator = req.loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    var query = {};

    if(cate === 1){
        if(params.groupId){
            query.groupId = params.groupId;
        }else{
            query.extendQuery = {
                group: {$exists: true}
            };
        }
        query.creator = creator;
        
    }else{
        ep.emit('error', 'not support query cate', ERR.PARAM_ERROR);
        return;
    }
    query.order = params.order;
    query.page = params.page;
    query.pageNum = params.pageNum;

    query.extendDefProps = {
        folder: ['_id', 'name'],
        group: ['_id', 'name'],
        creator: ['_id','nick', 'name']
    };

    mFile.search(query, ep.doneLater('search'));
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
