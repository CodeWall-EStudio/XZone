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
var userHelper = require('../helper/user_helper');
var fileHelper = require('../helper/file_helper');


// 新媒体资源(not delete)
//     + 活动名
//     
//     

function getUserInfo(skey, callback){

    var ep = new EventProxy();
    ep.fail(callback);

    // 去 sso 那用户名字和昵称
    userHelper.getUserInfo(skey, ep.doneLater('getUserInfo'));
    ep.on('getUserInfo', function(data){
        if(data.success && data.userInfo){
            ep.emit('getUserInfoSuccess', data.userInfo);
        }else{
            ep.emit('error', 'get userInfo error.');
        }
    });
    
    // 查询 user 数据库, 更新资料
    ep.on('getUserInfoSuccess', function(userInfo){

        var name = userInfo.loginName;
        var nick = userInfo.name;

        // name 是唯一的
        mUser.getUserByName(name, function(err, user){
            if(user){ // db已经有该用户, 更新资料
                user.nick = nick;

                mUser.save(user, ep.done('updateUserSuccess'));
            }else{
                mUser.create({
                    nick: nick,
                    name: name,
                    auth: 0, // 15 是管理员
                    size: config.DEFAULT_USER_SPACE,
                }, ep.done('updateUserSuccess'));
            }
        });
    });

    // 把拿到的用户信息回调
    ep.on('updateUserSuccess', function(user){
        callback(null, user);
    });
}

function getFolder(params, callback){
    var ep = new EventProxy();
    ep.fail(callback);

    mFolder.getFolder({
        name: params.name,
        'creator.$id': ObjectID(params.creator)
    }, ep.doneLater('getFolderSucc'));

    ep.on('getFolderSucc', function(folder){
        if(folder){
            callback(null, folder);
        }else{ // 没有, 新建一个
            mFolder.create({
                name: params.name,
                deletable: false,
                creator: params.creator,
                folderId: params.parentId
            }, callback);
        }
    });
}


exports.upload = function(req, res){

    var body = req.body;
    var loginUser;
    var uploadFilePath = body.file_path;
    var skey = req.cookies.skey;
    console.log('>>>media upload:');
    var activityId = body.activityId;

    var ep = new EventProxy();
    ep.fail(function(err, code){
        console.log('>>>media upload error:',{ err: code || ERR.SERVER_ERROR, msg: err });
        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });

    if(!skey){
        ep.emit('error', 'need login', ERR.NOT_LOGIN);
        return;
    }else if(!uploadFilePath){
        ep.emit('error', 'unsupport file type', ERR.NOT_SUPPORT);
        return;
    }

    getUserInfo(skey, ep.doneLater('getUserInfoSuccess'));

    ep.on('getUserInfoSuccess', function(user){
        loginUser = user;
        getFolder({
            name: '新媒体资源',
            creator: loginUser._id.toString(),
            parentId: user.rootFolder.oid.toString()
        }, ep.done('getMediaFolderSucc'));

    });

    ep.on('getMediaFolderSucc', function(mediaFolder){
        getFolder({
            name: activityId,
            creator: loginUser._id.toString(),
            parentId: mediaFolder._id.toString()
        }, ep.done('getActFolderSucc'));
    });
    
    ep.on('getActFolderSucc', function(activityFolder){
        var folderId = activityFolder._id.toString();

        fileHelper.saveUploadFile({
            folderId: folderId,
            loginUser: loginUser,
            body: body
        }, ep.done('saveFileSuccess'));

    });

    ep.on('saveFileSuccess', function(file){
        console.log('>>>media upload success:',file._id);
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
        //FIXME 新媒体文件夹的暂时不做权限检查
        ep.emit('checkRight', { file: file, resource: resource, folder: folder });
    });

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
    var skey = req.cookies.skey;
    
    var ep = new EventProxy();
    ep.fail(function(err, code){
        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });

    if(!skey){
        ep.emit('error', 'need login', ERR.NOT_LOGIN);
        return;
    }
    getUserInfo(skey, ep.doneLater('getUserInfoSuccess'));

    ep.on('getUserInfoSuccess', function(user){

        verifyDownload({
            fileId: fileId,
            creator: user._id.toString()
        }, ep.done('verifyDownloadSucc'));

    });

    ep.all('getUserInfoSuccess', 'verifyDownloadSucc', function(loginUser, data){
        var file = data.file, resource = data.resource, folder = data.folder;
        var filePath = path.join('/data/71xiaoxue/', resource.path);

        res.set({
            'Content-Type': resource.mimes,
            'Content-Disposition': 'attachment; filename=' + file.name,
            'Content-Length': resource.size,
            'X-Accel-Redirect': filePath
        });

        res.send();

        mLog.create({
            fromUserId: loginUser._id.toString(),
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