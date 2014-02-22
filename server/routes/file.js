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



exports.upload = function(req, res){
    var params = req.query;
    var folderId = params.folderId;
    //TODO 如果这个文件夹关闭了上传, 就不能传了
    var body = req.body;
    var loginUser = req.loginUser;
    var uploadFilePath = body.file_path;
    var ep = new EventProxy();

    ep.fail(function(err, code){
        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });


    if(!uploadFilePath){
        ep.emit('error', 'unsupport file type', ERR.NOT_SUPPORT);
        return;
    }

    // TODO MD5 重复的监测

    //1. 先把文件保存到 data 目录
    var savePath = U.formatDate(new Date(), 'yyyy/MM/dd/hhmm/');

    var filename = body.file_md5 + path.extname(body.file_name);
    var folderPath = path.resolve(path.join(config.FILE_SAVE_DIR, savePath));
    var filePath = path.join(folderPath, filename);

    var name = body.name;
    var fileSize = parseInt(body.file_size);
    var fileType = U.formatFileType(body.file_content_type);

    loginUser.used = Number(loginUser.used);

    

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

    ep.all('getFolder', 'saveRes', 'createFile', function(saveFolder, savedRes, file){
        if(savedRes){
            file.resource = U.filterProp(savedRes, ['_id', 'type', 'size']);
        }
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
            operateType: 1, 

            // srcFolderId: null,
            distFolderId: folderId,

            toGroupId: saveFolder.group && saveFolder.group.oid.toString()
        });

    });

    ep.on('updateSpaceUsed', function(){
        U.mkdirsSync(folderPath);
        U.moveFile(uploadFilePath, filePath, ep.done('moveFile'));
    });

    var oFolderId = ObjectID(folderId);
    mFolder.getFolder({_id: oFolderId}, ep.doneLater('getFolder'));
    mFile.getFile({ name: name, 'folder.$id': oFolderId }, ep.doneLater('getFile'));

    ep.all('getFolder', 'getFile', function(folder, file){
        if(!folder){
            ep.emit('error', 'no such folder', ERR.NOT_FOUND);
            return;
        }
        if(file){
            ep.emit('error', 'has the same fileName', ERR.DUPLICATE);
            return;
        }
        if(loginUser.size < loginUser.used + fileSize){
            //TODO 如果上传到小组, 还要检查小组的配额
            ep.emit('error', 'Ran out of space', ERR.SPACE_FULL);
        }else{
            // 更新用户size
            loginUser.used = loginUser.used + fileSize;
            var skey = req.cookies.skey;
            req.session[skey] = loginUser; // 更新 session
            mUser.update(loginUser._id, { used: loginUser.used }, ep.done('updateSpaceUsed'));
        }
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
        var filePath = path.join('/data/71xiaoxue/', resource.path);
        // console.log('redirect to :' + filePath);
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
        var zipDir = config.FILE_ZIP_DIR + dir;
        var zipPath = '/data/zip/' + dir + zipName;

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
            var filePath = path.join(config.FILE_SAVE_DIR, resource.path);
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
        var filePath = path.join('/data/71xiaoxue/', resource.path);

        if(resource.type === 8){//text
            fs.readFile(config.FILE_SAVE_DIR + resource.path, function(err, data){
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

        mFile.getFile({
            name: msg.fileName,
            'folder.$id': ObjectID(rootFolderId)
        }, function(err, file){
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
            name: msg.fileName,
            type: resource.type,
            size: resource.size,
            status: 1, //分享过来的文件
            resourceId: resource._id.toString()
        }

        mFile.create(file, ep.done('createFile'));
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
        file.status = 1; // 分享到小组的文件

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

    mFolder.getFolder({ _id: ObjectID(targetId) }, ep.doneLater('getFolder'));

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
            // distFolderId: toFolderId,
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

            return file;
        }));
        
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

exports.query = function(req, res){
    var params = req.query;
    var type = Number(params.type);
    var creator = req.loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    var query = {};

    if(type === 1){
        if(params.groupId){
            query.groupId = params.groupId;
        }else{
            query.extendQuery = {
                group: {$exists: true}
            };
        }
        query.creator = creator;
        
    }else{
        ep.emit('error', 'not support query type', ERR.PARAM_ERROR);
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
