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
var Logger = require('../logger');
var mFile = require('../models/file');
var mFolder = require('../models/folder');
var mRes = require('../models/resource');
var mUser = require('../models/user');
var mGroup = require('../models/group');

var mLog = require('../models/log');
var U = require('../util');

exports.saveUploadFile = function(params, callback) {
    var folder = params.folder;
    var loginUser = params.loginUser;
    var body = params.parameter;
    var groupId = folder.group && folder.group.oid;

    var uploadFilePath = body['file_path'];
    var name = body.name || body['file_name'];
    var md5 = body['file_md5'];
    var contentType = body['file_content_type'];
    var extname = path.extname(name);
    var suffix = extname && extname.slice(1);
    var filename = md5 + extname;
    var fileSize = Number(body['file_size']) || 0;
    var fileType = formatType(contentType, suffix);

    var savePath = U.formatDate(new Date(), 'yyyy/MM/dd/hhmm/');

    var folderPath = path.resolve(path.join(config.FILE_SAVE_ROOT, config.FILE_SAVE_DIR, savePath));
    var filepath = path.join(folderPath, filename);


    var ep = new EventProxy();
    ep.fail(callback);

    // TODO 在同一个文件夹下，不允许出现文件名相同且作者相同的文件。
    // 文件名相同且作者相同时，比较文件MD5。若MD5相同，提示重复文件，终止写操作；
    // 若MD5不同，提示改名后继续操作。
    if (!name) {

        return ep.emit('error', 'file name is required', ERR.PARAM_ERROR);
    }
    var query = {
        name: name,
        'folder.$id': folder._id,
        'creator.$id': loginUser._id
    };

    mFile.getFile(query, ep.doneLater('getFile'));

    ep.on('getFile', function(file) {

        if (file) {

            return ep.emit('error', 'has the same filename', ERR.DUPLICATE);
        }
        if (groupId) { // 上传到小组的, 检查小组配额
            mGroup.getGroup({
                _id: groupId
            }, function(err, group) {
                if (err) {
                    return ep.emit('error', err, ERR.SERVER_ERROR);
                }
                // Logger.debug(group, fileSize);
                mGroup.checkUsed(group, fileSize, ep.done('updateSpaceUsed'));
            });
        } else { // 检查个人配额

            mUser.checkUsed(loginUser, fileSize, ep.done('updateSpaceUsed'));
        }
    });

    ep.on('updateSpaceUsed', function() {

        if (groupId) {

            mGroup.updateUsed(groupId, fileSize, function() {});
        } else {

            mUser.updateUsed(loginUser._id, fileSize, function() {});
        }

        U.mkdirsSync(folderPath);
        U.moveFile(uploadFilePath, filepath, ep.done('moveFile'));
    });

    ep.on('moveFile', function() {

        // 添加 resource 记录
        var resource = {
            path: savePath + filename,
            md5: md5,
            size: fileSize,
            mimes: contentType,
            type: fileType
        };

        if (params.createSWFForDoc) {
            // 转换文档为 swf
            convert(filepath, contentType, suffix, function() {
                mRes.create(resource, ep.done('saveRes'));
            });
        } else {
            mRes.create(resource, ep.done('saveRes'));
        }

    });

    ep.on('saveRes', function(resource) {
        // 添加文件记录
        var file = {
            creator: loginUser._id,
            folderId: folder._id,
            name: name,
            type: fileType,
            size: fileSize,
            groupId: groupId,
            resourceId: resource._id
        };
        if(loginUser.auth & config.AUTH_SYS_MANAGER){
            file.status = 0;
        }
        resource.ref = 1;

        mFile.create(file, ep.done('createFile'));
    });

    ep.all('saveRes', 'createFile', function(savedRes, file) {
        if (savedRes) {
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

            toGroupId: groupId
        });

    });

};


function formatType(mimes, ext) {
    if (config.FILE_MIMES['image'].indexOf(mimes) > -1) {
        return 1;
    } else if (config.FILE_MIMES['document'].indexOf(mimes) > -1) {
        return 2;
    } else if (config.FILE_MIMES['pdf'].indexOf(mimes) > -1) {
        return 2;
    } else if (config.FILE_MIMES['audio'].indexOf(mimes) > -1) {
        return 3;
    } else if (config.FILE_MIMES['video'].indexOf(mimes) > -1) {
        return 4;
    } else if (config.FILE_MIMES['application'].indexOf(mimes) > -1) {
        return 5;
    } else if (config.FILE_MIMES['archive'].indexOf(mimes) > -1) {
        return 6;
    } else if (config.FILE_MIMES['text'].indexOf(mimes) > -1) {
        return 8;
    } else if (ext) {

        if (config.FILE_SUFFIX['image'].indexOf(ext) > -1) {
            return 1;
        } else if (config.FILE_SUFFIX['document'].indexOf(ext) > -1) {
            return 2;
        } else if (config.FILE_SUFFIX['pdf'].indexOf(ext) > -1) {
            return 2;
        } else if (config.FILE_SUFFIX['audio'].indexOf(ext) > -1) {
            return 3;
        } else if (config.FILE_SUFFIX['video'].indexOf(ext) > -1) {
            return 4;
        } else if (config.FILE_SUFFIX['application'].indexOf(ext) > -1) {
            return 5;
        } else if (config.FILE_SUFFIX['archive'].indexOf(ext) > -1) {
            return 6;
        } else if (config.FILE_SUFFIX['text'].indexOf(ext) > -1) {
            return 8;
        } else {
            return 7;
        }
    } else {
        return 7;
    }
}

function convert(filepath, mimes, ext, callback) {
    Logger.info('>>>convert file: mimes', filepath, mimes, ext);
    var cmd;
    //doc 文档要生成 swf 格式文件
    if (config.FILE_MIMES['document'].indexOf(mimes) > -1 || config.FILE_SUFFIX['document'].indexOf(ext) > -1) {
        cmd = 'java -jar ' + config.JOD_CONVERTER + ' ' + filepath + ' ' + filepath + '.pdf';
        Logger.info('>>>convert file: exec', cmd);
        process.exec(cmd, function(err, stdout, stderr) {
            if (!err) {
                cmd = 'pdf2swf ' + filepath + '.pdf -s flashversion=9 -o ' + filepath + '.swf';
                Logger.info('>>>convert file: exec', cmd);
                process.exec(cmd, function(err, stdout, stderr) {
                    callback(err);
                    Logger.error('>>>file convert error: to swf: ', err, stderr, mimes, ext);
                });
            } else {
                callback(err);
                Logger.error('>>>file convert error: to pdf', err, stderr, mimes, ext);
            }
        });
    } else if (config.FILE_MIMES['pdf'].indexOf(mimes) > -1 || config.FILE_SUFFIX['pdf'].indexOf(ext) > -1) {
        cmd = 'pdf2swf ' + filepath + '.pdf -s flashversion=9 -o ' + filepath + '.swf';
        Logger.info('>>>convert file: exec', cmd);
        process.exec(cmd, function(err, stdout, stderr) {
            callback(err);
            if (err) {
                Logger.error('>>>file convert error2: to swf', err, stderr, mimes, ext);
            }
        });

    } else {
        callback();
    }
}

exports.convertWord = convert;