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

exports.saveUploadFile = function(params, callback){
    var folderId = params.folderId;
    var loginUser = params.loginUser;
    var body = params.body;

    //1. 先把文件保存到 data 目录
    var uploadFilePath = body.file_path;
    var savePath = U.formatDate(new Date(), 'yyyy/MM/dd/hhmm/');

    var filename = body.file_md5 + path.extname(body.file_name);
    var folderPath = path.resolve(path.join(config.FILE_SAVE_DIR, savePath));
    var filePath = path.join(folderPath, filename);

    var name = body.name;
    var fileSize = parseInt(body.file_size);
    var fileType = U.formatFileType(body.file_content_type);

    loginUser.used = Number(loginUser.used);

    var ep = new EventProxy();
    ep.fail(callback);

    var oFolderId = ObjectID(folderId);
    mFolder.getFolder({_id: oFolderId}, ep.doneLater('getFolder'));
    // 在同一个文件夹下，不允许出现文件名相同且作者相同的文件。
    // 文件名相同且作者相同时，比较文件MD5。若MD5相同，提示重复文件，终止写操作；
    // 若MD5不同，提示改名后继续操作。
    mFile.getFile({ 
        name: name, 
        'folder.$id': oFolderId, 
        'creator.$id': loginUser._id
    }, ep.doneLater('getFile'));

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

            // 修改用户表的 used 
            mUser.updateUsed(file.creator.oid.toString(),  (fileSize || 0), ep.done('updateSpaceUsed'))

        }
    });

    ep.on('updateSpaceUsed', function(){
        U.mkdirsSync(folderPath);
        U.moveFile(uploadFilePath, filePath, ep.done('moveFile'));
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

        if(params.createSWFForDoc){
            //doc 文档要生成 swf 格式文件
            if(config.DOC_TYPES.indexOf(resource.mimes) > -1){
                var cmd = 'java -jar ' + config.JOD_CONVERTER + ' ' + filePath + ' ' + filePath + '.pdf';
                console.log('>>>file helper exec: ', cmd);
                process.exec(cmd, function(err){
                    if(!err){
                        cmd = 'pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf';
                        process.exec(cmd);
                        console.log('>>>file helper exec: ', cmd);
                    }
                });
            }
            if(config.PDF_TYPES.indexOf(resource.mimes) > -1){
                var cmd = 'pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf';
                process.exec(cmd);
                console.log('>>>file helper exec: ', cmd);
            }
        }

    });

    ep.on('saveRes', function(resource){
        // 添加文件记录
        var file = {
            creator: loginUser._id.toString(),
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
        callback(null, file);
        mLog.create({
            fromUserId: loginUser._id.toString(),
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

}