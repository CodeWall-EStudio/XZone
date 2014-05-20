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


function getFolder(params, callback){
    var ep = new EventProxy();
    ep.fail(callback);

    mFolder.getFolder({
        name: params.name,
        'creator.$id': params.creator
    }, ep.doneLater('getFolderSucc'));

    ep.on('getFolderSucc', function(folder){
        if(folder){
            callback(null, folder);
        }else{ // 没有, 新建一个
            mFolder.create({
                name: params.name,
                deletable: false,
                creator: params.creator,
                folder: params.parent
            }, callback);
        }
    });
}

exports.upload = function(req, res){

    var parameter = req.parameter;
    var loginUser;
    var skey = req.skey;
    console.log('>>>media upload, skey:',skey);
    var activityId = parameter.activityId;

    var ep = new EventProxy();
    ep.fail(function(err, code){
        console.log('>>>media upload error:',{ err: code || ERR.SERVER_ERROR, msg: err });
        // {"code":"200","msg":"\u4e0a\u4f20\u6210\u529f!","data":{"fid":292
        res.json({ code: code || ERR.SERVER_ERROR, msg: err });
    });

    if(!skey){
        ep.emit('error', 'need login', ERR.NOT_LOGIN);
        return;
    }else if(!parameter.file_path){
        ep.emit('error', 'upload file fail');
        return;
    }

    userHelper.findAndUpdateUserInfo(skey, config.AUTH_TYPE, ep.doneLater('getUserInfoSuccess'));

    ep.on('getUserInfoSuccess', function(user){
        loginUser = user;
        // TODO 这里应该有个 session 保存起来, 不要每次都去请求服务器
        mFolder.getFolder({ _id: user.rootFolder.oid }, ep.done('getRootFolder'));

    });

    ep.on('getRootFolder', function(rootFolder){
        getFolder({
            name: '新媒体资源',
            creator: loginUser._id,
            parent: rootFolder
        }, ep.done('getMediaFolderSucc'));

    });

    ep.on('getMediaFolderSucc', function(mediaFolder){
        getFolder({
            name: activityId + '',
            creator: loginUser._id,
            parent: mediaFolder
        }, ep.done('getActFolderSucc'));
    });
    
    ep.on('getActFolderSucc', function(activityFolder){

        fileHelper.saveUploadFile({
            folder: activityFolder,
            loginUser: loginUser,
            parameter: parameter
        }, ep.done('saveFileSuccess'));

    });

    ep.on('saveFileSuccess', function(file){
        console.log('>>>media upload success:',file._id);
        // {"code":"200","msg":"\u4e0a\u4f20\u6210\u529f!","data":{"fid":292
        res.json({ // 新媒体的返回结构不一样
            code: ERR.MEDIA_SUCCESS,
            msg: 'ok',
            data: {
                fid: file._id
            }
        });
    });

};

function verifyDownload(params, callback){

    var file = params.file;
    // var creator = params.creator;

    var ep = new EventProxy();
    ep.fail(callback);

    mFolder.getFolder({ _id: file.folder.oid }, ep.doneLater('getFolder'));

    mRes.getResource({ _id: file.resource.oid }, ep.doneLater('getRes'));

    ep.all('getFolder', 'getRes', function(folder, resource){
        if(!resource){
            ep.emit('error', 'no such resource: ' + file.resource.oid, ERR.NOT_FOUND);
            return;
        }
        file.__folder = folder;
        file.__resource = resource;

        //FIXME 新媒体文件夹的暂时不做权限检查
        callback(null, file);
        // ep.emit('checkRight', { file: file, resource: resource, folder: folder });
    });

    // ep.on('checkRight', function(data){
    //     if(data){ // 是自己所在小组的
    //         callback(null, data);
    //     }else{
    //         ep.emit('error', 'not auth to access this file: ' + fileId, ERR.NOT_AUTH);
    //     }
    // });

}

exports.download = function(req, res){

    var parameter = req.parameter;

    var file = parameter.fileId;
    var skey = req.skey;
    
    var ep = new EventProxy();
    ep.fail(function(err, code){
        if(code === ERR.NOT_FOUND){
            return res.send(404);
        }

        res.json({ err: code || ERR.SERVER_ERROR, msg: err });
    });

    console.log('>>>media download, skey: ', skey);

    // if(!skey){
    //     ep.emit('error', 'need login', ERR.NOT_LOGIN);
    //     return;
    // }
    // userHelper.findAndUpdateUserInfo(skey, 'sso', ep.doneLater('getUserInfoSuccess'));

    // ep.on('getUserInfoSuccess', function(user){

        verifyDownload({
            file: file
            // creator: user._id
        }, ep.done('verifyDownloadSucc'));

    // });

    ep.all(/*'getUserInfoSuccess', */'verifyDownloadSucc', function(/*loginUser, */data){
        var resource = file.__resource, folder = file.__folder;
        var filePath = path.join(config.FILE_SAVE_DIR, resource.path);
        console.log('>>>media download: ' + filePath, ':', resource.mimes);
        res.set({
            'Content-Type': resource.mimes,
            'Content-Disposition': 'attachment; filename=' + file.name,
            'Content-Length': resource.size,
            'X-Accel-Redirect': filePath
        });

        res.send();

        mLog.create({
            // fromUserId: loginUser._id,
            fromUserId: null,
            fromUserName: 'media download',

            fileId: file._id,
            fileName: file.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存
            operateType: 2,

            srcFolderId: file.folder.oid,
            // distFolderId: folderId,
            fromGroupId: folder ? folder.group && folder.group.oid : null
            // toGroupId: saveFolder.group || saveFolder.group.oid
        });
    });
};