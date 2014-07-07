var fs = require('fs');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var process = require('child_process');
var archiver = require('archiver');
var us = require('underscore');
var images = require('images');

var db = require('../models/db');
var config = require('../config');
var ERR = require('../errorcode');
var Logger = require('../logger');
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
    var parameter = req.parameter;
    var folder = parameter.folderId;

    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, code){
        console.log('>>>file upload error:',{ err: code || ERR.SERVER_ERROR, msg: err });
        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });

    if(!parameter.file_path){
        ep.emit('error', 'upload file fail');
        return;
    }

    fileHelper.saveUploadFile({
        folder: folder,
        loginUser: loginUser,
        parameter: parameter,
        createSWFForDoc: true
    }, ep.done('saveFileSuccess'));

    ep.on('saveFileSuccess', function(file){
        console.log('>>>file upload success:',file._id);
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: file
            }
        });
    });
};

exports.download = function(req, res){
    var parameter = req.parameter;
    var file = parameter.fileId;
    var loginUser = req.loginUser;
    
    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err });
    });

    var folder = file.__folder;
    var resource = file.__resource;
    var group = file.__group;

    var filePath = path.join(config.FILE_SAVE_DIR, resource.path);
    Logger.info('redirect to :' + filePath, 'mimes: ' + resource.mimes);
    res.set({
        'Content-Type': resource.mimes,
        'Content-Disposition': 'attachment; filename=' + file.name,
        'Content-Length': resource.size,
        'X-Accel-Redirect': filePath
    });

    res.send();

    mLog.create({
        fromUser: loginUser,


        file: file,

        //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
        //6: delete 7: 预览 8: 保存
        operateType: 2,

        srcFolder: folder,

        fromGroup: group
    });

};

exports.batchDownload = function(req, res){
    var parameter = req.parameter;

    var files = parameter.fileId;
    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err });
    });


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

    files.forEach(function(file){

        var resource = file.__resource,
            folder = file.__folder,
            group = folder.__group;

        var filePath = path.join(config.FILE_SAVE_ROOT, config.FILE_SAVE_DIR, resource.path);
        archive.file(filePath, { name: file.name });

        mLog.create({
            fromUser: loginUser,

            file: file,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存
            operateType: 2,

            srcFolder: folder,

            fromGroup: group
        });

    });
    archive.finalize();



};

exports.preview = function(req, res){
    var parameter = req.parameter;

    var file = parameter.fileId;
    var message = parameter.messageId;
    var size = parameter.size;
    var imgSize;

    if(size){ // 如果类型是图片, 可以指定图片的预览图大小
        imgSize = size.split('_');
        if(imgSize.length === 2){
            imgSize[0] = Number(imgSize[0]);
            imgSize[1] = Number(imgSize[1]);
            if(!imgSize[0] || !imgSize[1]){
                imgSize = null;
            }
        }
    }
    var loginUser = req.loginUser;

    var resource, folder;
    if(file){
        resource = file.__resource;
        folder = file.__folder;
    }
    if(message){
        resource = message.__resource;
    }
        
    //1. 图片, 直接给url
    //2. 文档, 给出swf url
    //3. txt, 给出 text的文本内容
    //4. 音频/视频, 直接给出url

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
            var swfFile = path.join(config.FILE_SAVE_ROOT, filePath + '.swf');
            if(!fs.existsSync(swfFile)){
                Logger.error('can\'t find ' + swfFile + '! try to convert...');
                var suffix = path.extname(filePath).slice(1);
                fileHelper.convertWord(path.join(config.FILE_SAVE_ROOT, filePath), resource.mimes, suffix, function(err){
                    if(err){
                        res.json({ err: ERR.NOT_FOUND, msg: 'can not find this file and convert failure' });
                        return;
                    }
                    Logger.info('convert success: ' + filePath);
                    res.set({
                        'Content-Type': 'application/x-shockwave-flash',
                        'X-Accel-Redirect': filePath + '.swf'
                    });
                    res.send();
                });
            }else{
                res.set({
                    'Content-Type': 'application/x-shockwave-flash',
                    'X-Accel-Redirect': filePath + '.swf'
                });
                res.send();
            }
            break;
        
        case 3://audio
        case 4://video
        case 5://stream

            res.set({
                'Content-Type': resource.type,
                'X-Accel-Redirect': filePath
            });
            res.send();
            break;

        case 1://image
            if(imgSize){
                
                var absPath = path.join(config.FILE_SAVE_ROOT, filePath + '.' + size);
                if(!fs.existsSync(absPath)){
                    Logger.info('[preview] image ' + absPath + ' is not exists, try create');
                    images(path.join(config.FILE_SAVE_ROOT, filePath))
                            .size(imgSize[0], imgSize[1]).save(absPath);
                }
            }
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
        fromUser: loginUser,

        resource: resource,

        //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
        //6: delete 7: 预览 8: 保存
        operateType: 7,

        file: file,

        srcFolder: folder,

        // distFolderId: folderId,
        fromGroupId: folder ? folder.group && folder.group.oid : null
        // toGroupId: saveFolder.group || saveFolder.group.oid
    });
};

// 保存收件箱中的文件到自己的目录
exports.save = function(req, res){
    var params = req.parameter;
    var loginUser = req.loginUser;

    var msg = params.messageId;
    var rootFolderId = loginUser.rootFolder.oid;

    if(params.folderId){
        rootFolderId = params.folderId._id;
    }

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    var param = {
        name: msg.name,
        'folder.$id': rootFolderId
    };
    Logger.debug('>>>file.save check file', param);
    // 检查重名
    mFile.getFile(param, function(err, file){
        if(file){
            ep.emit('error', 'has the same filename: ' + msg.name, ERR.DUPLICATE);
            return;
        }
        mRes.getResource({ _id: msg.resource.oid }, ep.done('getResource'));
    });
        
    ep.on('getResource', function(resource){

        // 暂时只做保存到个人根目录的功能, 如果要前端传来folder, auth_config 需要进行权限判断
        mUser.checkUsed(loginUser, resource.size, ep.done('checkSpaceUsed'));
    });

    ep.all('getResource', 'checkSpaceUsed', function(resource){

        var file = { // 这里不用保存 group, 只会是保存到自己的目录
            creator: loginUser._id,
            folderId: rootFolderId,
            name: msg.name,
            type: resource.type,
            size: resource.size,
            src: 1, //分享过来的文件
            resourceId: resource._id
        };

        mFile.create(file, ep.done('createFile'));
        
        mUser.updateUsed(loginUser._id, resource.size, function(){});
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
            fromUser: loginUser,

            file: file,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存
            operateType: 8,

            distFolderId: rootFolderId
        });


    });

};

exports.get = function(req, res){
    var params = req.parameter;
    var file = params.fileId;

    // var loginUser = req.loginUser;

    db.dereference(file, { resource: ['_id', 'type', 'size'] }, function(/*err*/){
        
        U.removePrivateMethods(file);
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: file
            }
        });
    });
};

function shareToUser(loginUser, params, callback){
    var file = params.file;
    var user = params.user;

    var content = params.content || '';

    var ep = new EventProxy();
    ep.fail(callback);


    // 获取资源
    mRes.getResource({ _id: file.resource.oid}, ep.doneLater('getResource'));

    ep.on('getResource', function(resource){
        if(!resource){
            ep.emit('error', 'no such file', ERR.NOT_FOUND);
            return;
        }
        var msg = {
            content: content,
            toUserId: user._id,
            fromUserId: loginUser._id,
            fileName: file.name,
            fileType: resource.type,
            fileSize: resource.size,

            resourceId: resource._id
        };
        
        // 创建一条分享消息
        mMessage.create(msg, callback);


        // 记录该操作
        mLog.create({
            fromUser: loginUser,

            toUser: user,

            file: file,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 9,

            srcFolderId: file.folder.oid
        });

    });
}

function shareToUsers(loginUser, params, callback){
    var users = params.users;
    var ep = new EventProxy();
    ep.fail(callback);
    
    ep.after('shareToUser', users.length, function(list){
        callback(null);
    });
    users.forEach(function(user){
        shareToUser(loginUser, {
            file: params.file,
            user: user,
            content: params.content
        }, ep.group('shareToUser'));
    });
}


function shareToGroup(loginUser, params, callback){
    var file = params.file;
    var group = params.group;
    var folder = params.folder;

    var ep = new EventProxy();
    ep.fail(callback);

    /*if(!group){
        mGroup.getGroup({ _id: folder.group.oid }, function(err, gp){
            if(err){
                return callback(err);
            }
            group = gp;
            ep.emit('ready');
        });
    }else */
    if(!folder){
        mFolder.getFolder({ _id: group.rootFolder.oid }, function(err, fld){
            if(err){
                return callback(err);
            }
            folder = fld;
            ep.emit('ready');
        });
    }else{
        ep.emitLater('ready');
    }

    ep.on('ready', function(){
        
        mFile.getFile({ // 重名检查
            name: file.name,
            'folder.$id': folder._id
        }, ep.done('getFile'));
    });

    ep.on('getFile', function(fl){
        if(fl){
            return ep.emit('error', 'file name duplicate, filename: ' + file.name, ERR.DUPLICATE);
        }

        //如果是分享给小组和部门, 要扣掉空间占用
        //分享给学校的, 则要审核之后才扣
        if(group.type === 1 || group.type === 2){
            mGroup.updateUsed(group._id, file.size, function(){});
        }


        // 拷贝 到目标文件夹
        file.resourceId = file.resource.oid;

        file.groupId = group._id;
        file.folderId  = folder._id;
        file.creator = loginUser._id;
        file.src = 1; // 分享到小组的文件

        var srcFolderId = file.folder.oid;
        mFile.create(file, callback);

        // 记录该操作
        mLog.create({
            fromUser: loginUser,

            file: file,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 10,

            srcFolderId: srcFolderId,

            distFolder: folder,

            toGroup: group
        });

    });
    
}

function shareToGroups(loginUser, params, callback){
    var file = params.file;
    var groups = params.groups;
    var folders = params.folders || [];

    var ep = new EventProxy();
    ep.fail(callback);

    ep.after('shareToGroup', groups.length, function(list){
        callback(null, list);
    });
    for(var i = 0; i < groups.length; i++){
        shareToGroup(loginUser, {
            file: file,
            group: groups[i],
            folder: folders[i]
        }, ep.group('shareToGroup'));
    }

}

exports.share = function(req, res){

    var params = req.parameter;
    var loginUser = req.loginUser;

    var files = params.fileId;
    var toUsers = params.toUserId;
    var toGroups = params.toGroupId;
    var toFolders = params.toFolderId;
    var content = params.content;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    if(toUsers && toUsers.length){

    }else if(toGroups && toGroups.length){

    }else{
        ep.emit('error', 'must has a share target', ERR.PARAM_ERROR);
        return;
    }
    ep.after('share', files.length, function(list){
        res.json({
            err: ERR.SUCCESS
        });
    });

    files.forEach(function(file){
        if(toGroups){// 共享给多个小组
            shareToGroups(loginUser, {
                file: file,
                groups: toGroups,
                folders: toFolders,
            }, ep.group('share'));
        }else{
            shareToUsers(loginUser, {// 共享给多个人
                file: file,
                users: toUsers,
                content: content
            }, ep.group('share'));
        }
    });
};

function modifyFile(user, params, callback){
    var file = params.fileId;

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
    if('isArchive' in params){
        doc.isArchive = params.isArchive;
    }

    var ep = new EventProxy();
    ep.fail(callback);

    if(params.name && params.name !== file.name){
        // 检查重名
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
        ep.emitLater('checkName', true);
    }

    ep.on('checkName', function(result){
        if(!result){
            ep.emit('error', 'has the same filename: ' + params.name + ' in this folder', ERR.DUPLICATE);
            return;
        }
        var oldFileName = file.name;

        mFile.modify({ _id: file._id }, doc, callback);

        var folder = file.__folder;

        // 记录该操作
        mLog.create({
            fromUser: user,

            file: file,
            oldFileName: oldFileName,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 5,

            srcFolderId: folder ? folder._id : file.folder.oid
        });

    });
}

exports.modify = function(req, res){

    modifyFile(req.loginUser, req.parameter, function(err, file){
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
};

function copyFile(user, params, callback){
    var file = params.file;

    var targetFolder = params.targetFolder;

    var groupId = targetFolder.group && targetFolder.group.oid;
    var rootGroup;

    var ep = new EventProxy();
    ep.fail(callback);


    mFile.getFile({ // 重名检查
        name: file.name,
        'folder.$id': targetFolder._id
    }, function(err, fl){
        if(fl){

            return ep.emit('error', 'file name duplicate', ERR.DUPLICATE);
        }

        if(groupId){ // 上传到小组的, 检查小组配额
            mGroup.getGroup({ _id: groupId }, function(err, group){
                if(err){
                    return ep.emit('error', err, ERR.SERVER_ERROR);
                }
                rootGroup = group;
                mGroup.checkUsed(group, file.size, ep.done('checkSpaceUsed'));
            });
        }else{ // 检查个人配额
            
            mUser.checkUsed(user, file.size, ep.done('checkSpaceUsed'));
        }

    });


    ep.on('checkSpaceUsed', function(){

        if (groupId) {

            mGroup.updateUsed(groupId, file.size, ep.done('updateSpaceUsed'));
        } else {

            mUser.updateUsed(user._id, file.size, ep.done('updateSpaceUsed'));
        }
    });

    ep.on('updateSpaceUsed', function(){

        // 权限检查没问题
        file.resourceId = file.resource.oid;

        file.groupId = groupId;
        file.folderId  = targetFolder._id;
        file.creator = user._id;
        
        mFile.create(file, callback);


        // 记录该操作
        mLog.create({
            fromUser: user,

            file: file,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 3,

            srcFolderId: file.folder.oid,

            distFolder: targetFolder,

            toGroupId: groupId
        });

    });
}

exports.copy = function(req, res){
    var params = req.parameter;
    var files = params.fileId;
    // var group = params.groupId;
    var targetFolder = params.targetId;

    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('copy', files.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    files.forEach(function(file){
        copyFile(loginUser, {
            file: file,
            targetFolder: targetFolder
        }, ep.group('copy'));
    });

};

function moveFile(user, params, callback){
    var ep = new EventProxy();
    ep.fail(callback);

    var file = params.file;
    var targetFolder = params.targetFolder;

    mFile.getFile({ // 重名检查
        name: file.name,
        'folder.$id': targetFolder._id
    }, function(err, fl){
        if (fl) {
            return ep.emit('error', 'file name duplicate', ERR.DUPLICATE);
        }
        // move file 不用检查空间
        var doc = {
            folder: new DBRef('folder', targetFolder._id)
        };

        mFile.modify({ _id: file._id }, doc, callback);

        var targetGroup = targetFolder.__group;

        // 记录该操作
        mLog.create({
            fromUser: user,

            file: file,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组
            operateType: 4,

            srcFolderId: file.folder.oid,

            distFolder: targetFolder,

            fromGroupId: targetGroup ? targetGroup._id : (targetFolder.group && targetFolder.group.oid),

        });
    });
}

exports.move = function(req, res){
    var params = req.parameter;

    var files = params.fileId;
    // var groupId = params.groupId;
    var targetFolder = params.targetId;

    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('move', files.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    files.forEach(function(file){
        moveFile(loginUser, {
            file: file,
            targetFolder: targetFolder
        }, ep.group('move'));
    });

};


exports.delete = function(req, res){

    var params = req.parameter;
    var files = params.fileId;
    var loginUser = req.loginUser;


    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('delete', files.length, function(){
        res.json({
            err: ERR.SUCCESS
        });
    });
    
    files.forEach(function(file){
        // 设置删除标志位
        // 如果删除的是小组的文件, 也是直接设置个标志位, 放到回收站
        var folder = file.__folder;
        var group = folder.__group;
        mFile.modify({ _id: file._id }, { del: true },
                ep.group('delete', function(file){

            // 记录该操作
            mLog.create({
                fromUser: loginUser,


                file: file,

                //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 11: delete(移动到回收站)
                operateType: 11,

                srcFolderId: folder ? folder._id : file.folder.oid,
                srcFolderName: folder && folder.name,


                fromGroupId: folder && folder.group && folder.group.oid,
                fromGroupName: group && group.name

            });
            
            return file;
        }));
        
    });

};


exports.search = function(req, res){
    var parameter = req.parameter;
    var folder = parameter.folderId;

    var loginUser = req.loginUser;
    var creator = parameter.creatorId;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
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

    var searchParams = us.extend({}, parameter, {
        folderId: folder._id,
        isDeref: true
    });


    Logger.debug('file/search: ', folder._id, 'user role: ', loginUser.__role, 'folder role: ', folder.__role);

    if(creator){
        
        searchParams.creator = creator._id;
    }else if(folder.__role & config.FOLDER_PRIVATE){

        // 个人空间搜索, 搜索自己创建的文件
        searchParams.creator = loginUser._id;
    }else if(folder.__role & config.FOLDER_SCHOOL){
        // 学校空间的文件夹
        searchParams.extendQuery = {};
        if(('status' in searchParams) && (loginUser.__role & config.ROLE_MANAGER)){
            // 管理员可以使用 status 参数搜索
            searchParams.extendQuery.status = searchParams.status || 0;
        }else{
            // 否则只返回审核通过的文件
            searchParams.extendQuery.validateStatus = 1;
        }
    }else if(loginUser.__role & config.ROLE_FOLDER_MEMBER){

        // 小组/部门成员
        Logger.debug('file/search: ROLE_FOLDER_MEMBER');
    }else if(folder.__role & config.FOLDER_DEPARTMENT_PRIVATE){

        // 非部门公開就不返回內容
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: 0,
                list: []
            }
        });
        return;
    }else if(folder.__role & config.FOLDER_DEPARTMENT_PUBLIC){
        // 公開文件夾下只能看到部门成员和本人上传的文件
        var ids = [loginUser._id];
        mGroup.getGroupMemberIds(folder.group.oid, function(err, docs){
            if(docs && docs.length){
                docs.forEach(function(doc){
                    ids.push(doc.user.oid);
                });
            }
            searchParams.extendQuery = {
                'creator.$id': { $in: us.uniq(ids) }
            };

            mFile.search(searchParams, ep.done('search'));
        });
        return;
    }

    mFile.search(searchParams, ep.done('search'));

};

/**
 * 查询该用户共享给其他部门的文件
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.query = function(req, res){
    var parameter = req.parameter;
    var cate = parameter.cate;
    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    var searchParams = us.extend({}, parameter);
    searchParams.isDeref = true;

    var group = parameter.groupId;

    if(cate === 1){
        if(!group){
            searchParams.extendQuery = {
                group: {$exists: true}
            };
        }else{
            searchParams.groupId = group._id;
        }
        searchParams.creator = loginUser._id;
    }else{
        ep.emit('error', 'not support query cate', ERR.PARAM_ERROR);
        return;
    }

    searchParams.extendDefProps = {
        folder: ['_id', 'name'],
        group: ['_id', 'name'],
        creator: ['_id','nick', 'name']
    };

    mFile.search(searchParams, ep.doneLater('search'));

    ep.on('search', function(total, docs){
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
};

/**
 * 统计文件类型和占用量
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.statistics = function(req, res){
    var parameter = req.parameter;
    var folder = parameter.folderId;

    mFile.statistics(folder._id, {}, function(err, result){

        if(err){
            return res.json({ err: result || ERR.SERVER_ERROR, msg: err});
        }
        res.json({
            err: ERR.SUCCESS,
            result: result
        });

    });
};

