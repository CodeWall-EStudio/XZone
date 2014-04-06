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
    var folder = params.folder;
    var loginUser = params.loginUser;
    var body = params.parameter;

    //1. 先把文件保存到 data 目录
    var uploadFilePath = body.file_path;
    var name = body.file_name;
    var md5 = body.file_md5;
    var contentType = body.file_content_type;
    var extname = path.extname(name);
    var suffix = extname && extname.slice(1);
    var filename = md5 + extname;
    var fileSize = parseInt(body.file_size);
    var fileType = formatType(contentType, suffix);

    var savePath = U.formatDate(new Date(), 'yyyy/MM/dd/hhmm/');

    var folderPath = path.resolve(path.join(config.FILE_SAVE_ROOT, config.FILE_SAVE_DIR, savePath));
    var filePath = path.join(folderPath, filename);

    loginUser.used = Number(loginUser.used);

    var ep = new EventProxy();
    ep.fail(callback);

    // 在同一个文件夹下，不允许出现文件名相同且作者相同的文件。
    // 文件名相同且作者相同时，比较文件MD5。若MD5相同，提示重复文件，终止写操作；
    // 若MD5不同，提示改名后继续操作。
    if(!name){
        ep.emit('error', 'file name is required', ERR.PARAM_ERROR);
        return;
    }
    var query = {
        name: name,
        'folder.$id': folder._id,
        'creator.$id': loginUser._id
    };
    // console.log('>>>check file name', query);
    mFile.getFile(query, ep.doneLater('getFile'));

    ep.on('getFile', function(file){

        if(file){
            ep.emit('error', 'has the same filename', ERR.DUPLICATE);
            return;
        }
        if(loginUser.size < loginUser.used + fileSize){
            //TODO 如果上传到小组, 还要检查小组的配额
            ep.emit('error', 'Ran out of space', ERR.SPACE_FULL);
        }else{
            // 更新用户size
            loginUser.used = loginUser.used + fileSize;

            // 修改用户表的 used 
            mUser.updateUsed(loginUser._id,  (fileSize || 0), ep.done('updateSpaceUsed'));

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
            md5: md5,
            size: fileSize,
            mimes: contentType,
            type: fileType
        };

        if(params.createSWFForDoc){
            // 转换文档为 swf
            convert(filePath, contentType, suffix, function(){
                mRes.create(resource, ep.done('saveRes'));
            });
        }else{
            mRes.create(resource, ep.done('saveRes'));
        }

    });

    ep.on('saveRes', function(resource){
        // 添加文件记录
        var file = {
            creator: loginUser._id,
            folderId: folder._id,
            name: name,
            type: fileType,
            size: fileSize,
            groupId: folder.group && folder.group.oid,
            resourceId: resource._id
        };
        resource.ref = 1;

        mFile.create(file, ep.done('createFile'));
    });

    ep.all('saveRes', 'createFile', function(savedRes, file){
        if(savedRes){
            file.resource = U.filterProp(savedRes, ['_id', 'type', 'size']);
        }
        callback(null, file);
        // 打log
        mLog.create({
            fromUserId: loginUser._id.toString(),
            fromUserName: loginUser.nick,

            fileId: file._id.toString(),
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存
            operateType: 1,

            // srcFolderId: null,
            distFolderId: folder._id.toString(),

            toGroupId: folder.group && folder.group.oid.toString()
        });

    });

};

function formatType(mimes, ext){
    if (  config.FILE_MIMES['image'].indexOf(mimes) > -1 ) {
        return 1;
    } else if (  config.FILE_MIMES['document'].indexOf(mimes) > -1 ) {
        return 2;
    } else if (  config.FILE_MIMES['pdf'].indexOf(mimes) > -1 ) {
        return 2;
    } else if ( config.FILE_MIMES['audio'].indexOf(mimes) > -1 ) {
        return 3;
    } else if ( config.FILE_MIMES['video'].indexOf(mimes) > -1 ) {
        return 4;
    } else if ( config.FILE_MIMES['application'].indexOf(mimes) > -1 ) {
        return 5;
    } else if ( config.FILE_MIMES['archive'].indexOf(mimes) > -1 ) {
        return 6;
    } else if ( config.FILE_MIMES['text'].indexOf(mimes) > -1 ) {
        return 8;
    } else if(ext){

        if ( config.FILE_SUFFIX['image'].indexOf(ext) > -1 ) {
            return 1;
        } else if ( config.FILE_SUFFIX['document'].indexOf(ext) > -1 ) {
            return 2;
        } else if ( config.FILE_SUFFIX['pdf'].indexOf(ext) > -1 ) {
            return 2;
        } else if ( config.FILE_SUFFIX['audio'].indexOf(ext) > -1 ) {
            return 3;
        } else if ( config.FILE_SUFFIX['video'].indexOf(ext) > -1 ) {
            return 4;
        } else if ( config.FILE_SUFFIX['application'].indexOf(ext) > -1 ) {
            return 5;
        } else if ( config.FILE_SUFFIX['archive'].indexOf(ext) > -1 ) {
            return 6;
        } else if ( config.FILE_SUFFIX['text'].indexOf(ext) > -1 ) {
            return 8;
        } else {
            return 7;
        }
    }else{
        return 7;
    }
}

function convert(filePath, mimes, ext, callback){
    console.log('>>>convert file: mimes',filePath, mimes, ext);
    var cmd;
    //doc 文档要生成 swf 格式文件
    if(config.FILE_MIMES['document'].indexOf(mimes) > -1 || config.FILE_SUFFIX['document'].indexOf(ext) > -1){
        cmd = 'java -jar ' + config.JOD_CONVERTER + ' ' + filePath + ' ' + filePath + '.pdf';

        process.exec(cmd, function(err, stdout, stderr){
            if(!err){
                cmd = 'pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf';
                process.exec(cmd, function(err, stdout, stderr){
                    callback(err);
                    console.error('>>>file convert error: to swf: ', err, stdout, stderr, mimes, ext);
                });
            }else{
                callback(err);
                console.error('>>>file convert error: to pdf', err, stdout, stderr, mimes, ext);
            }
        });
    }else if(config.FILE_MIMES['pdf'].indexOf(mimes) > -1 || config.FILE_SUFFIX['pdf'].indexOf(ext) > -1){
        cmd = 'pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf';
        process.exec(cmd, function(err, stdout, stderr){
            callback(err);
            if(err){
                console.error('>>>file convert error: to swf', err, stdout, stderr, mimes, ext);
            }
        });

    }else{
        callback();
    }
}

exports.convertWord = convert;

