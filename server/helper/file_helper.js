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

    var oFolderId = ObjectID(folderId);
    mFolder.getFolder({_id: oFolderId}, ep.doneLater('getFolder'));
    // 在同一个文件夹下，不允许出现文件名相同且作者相同的文件。
    // 文件名相同且作者相同时，比较文件MD5。若MD5相同，提示重复文件，终止写操作；
    // 若MD5不同，提示改名后继续操作。
    if(!name){
        ep.emit('error', 'file name is required', ERR.PARAM_ERROR);
        return;
    }
    var query = { 
        name: name, 
        'folder.$id': oFolderId, 
        'creator.$id': loginUser._id
    };
    console.log('>>>check file name', query);
    mFile.getFile(query, ep.doneLater('getFile'));

    ep.all('getFolder', 'getFile', function(folder, file){
        if(!folder){
            ep.emit('error', 'no such folder', ERR.NOT_FOUND);
            return;
        }
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
            mUser.updateUsed(loginUser._id.toString(),  (fileSize || 0), ep.done('updateSpaceUsed'))

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
        }

        mRes.create(resource, ep.done('saveRes'));

        if(params.createSWFForDoc){
            // 转换文档为 swf
            convert(filePath, contentType, suffix);
        }

    });

    ep.all('getFolder', 'saveRes', function(folder, resource){
        // 添加文件记录
        var file = {
            creator: loginUser._id.toString(),
            folderId: folderId,
            name: name,
            type: fileType,
            size: fileSize,
            groupId: folder.group && folder.group.oid.toString(),
            resourceId: resource._id.toString()
        }
        resource.ref = 1;

        mFile.create(file, ep.done('createFile'));
    });

    ep.all('getFolder', 'saveRes', 'createFile', function(folder, savedRes, file){
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

            toGroupId: folder.group && folder.group.oid.toString()
        });

    });

}

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

function convert(filePath, mimes, ext){
    console.log('>>>convert file: mimes',mimes,ext);
    //doc 文档要生成 swf 格式文件
    if(config.FILE_MIMES['document'].indexOf(mimes) > -1 || config.FILE_SUFFIX['document'].indexOf(ext) > -1){
        var cmd = 'java -jar ' + config.JOD_CONVERTER + ' ' + filePath + ' ' + filePath + '.pdf';

        process.exec(cmd, function(err){
            if(!err){
                cmd = 'pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf';
                process.exec(cmd);
            }else{
                console.log('>>>file convert error: ', err, mimes, ext);
            }
        });
    }
    if(config.FILE_MIMES['pdf'].indexOf(mimes) > -1 || config.FILE_SUFFIX['pdf'].indexOf(ext) > -1){
        var cmd = 'pdf2swf ' + filePath + '.pdf -s flashversion=9 -o ' + filePath + '.swf';
        process.exec(cmd);

    }
}

exports.hasFolderAccessRight = function(userId, folderId, groupId, callback){

    var ep = new EventProxy();
    ep.fail(callback);
    
    mFolder.getFolder({_id: ObjectID(folderId)}, ep.doneLater('getFolder'));

    ep.on('getFolder', function(folder){
        if(!folder){
            return ep.emit('error', 'no such folder', ERR.NOT_FOUND);
        }
        if(!groupId && folder.group){ // 如果没传入 group, 且文件夹有group, 自动使用改group
            groupId = folder.group.oid.toString();
        }
        if(groupId){
            mGroup.getGroup(groupId, ep.done('getGroup'));
        }else{
            ep.emit('getGroup', false);
        }
    });

    
    ep.all('getFolder', 'getGroup', function(folder, group){
        if(groupId && !group){
            return ep.emit('error', 'a wrong groupId');
        }

        // 下面检查文件夹是否是该用户的, 以及 该用户是否是小组成员
        if(!groupId){
            // 检查该用户是否是该文件夹所有者
            return ep.emit('checkRight', userId === folder.creator.oid.toString() ? 'creator' : false);
        }
        // 检查该用户是否是小组成员
        if(group.type === 0){ // type=0 是学校空间
            ep.emit('checkRight', 'school');
        }else if(group.type === 3){ // 这是备课小组, 如果是备课的成员都能看
            // 先检查是不是属于该组的成员
            mGroup.isGroupMember(groupId, userId, ep.doneLater('checkMemberRight'));

            ep.on('checkMemberRight', function(hasRight){
                if(hasRight){
                    ep.done('checkRight', 'member');
                }else{ // 检查是否是备课小组的成员
                    mGroup.isPrepareMember(userId, ep.done('checkRight', function(hasRight){
                        if(hasRight){
                            return 'prepare';
                        }
                        return hasRight;
                    }));
                }
            });
        }else if(group.type === 2 && folder.isOpen){ // 部门的公开文件夹, 允许查看
            ep.emit('checkRight', 'pubFolder');
        }else{// 是否是部门成员
            mGroup.isGroupMember(groupId, userId, ep.done('checkRight', function(hasRight){
                if(hasRight){
                    return 'member';
                }
                return hasRight;
            }));
        }

    });
    
    ep.all('checkRight', 'getFolder', 'getGroup', function(role, folder, group){
        console.log('checkRight, role: ', role);
        callback(null, role, folder, group);
    });
}