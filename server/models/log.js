var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var EventEmitter = require('events').EventEmitter;
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var mRes = require('./resource');
var mFile = require('./file');

exports.create = function(params, callback){

    var creator = params.creator;
    var fileId = params.fileId;

    var doc = {
        fromUserId: params.fromUserId,
        fromUserName: params.fromUserName,

        fileId: params.fileId,
        fileName: params.fileName,

        folderId: params.folderId,
        folderName: params.folderName,

        operateTime: Date.now(),
        //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
        //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
        //11: delete(移动到回收站) 12: 创建文件夹
        operateType: params.operateType, 

        srcFolderId: params.srcFolderId,
        distFolderId: params.distFolderId

    }
    if(params.fromGroupId){
        doc.fromGroupId = params.fromGroupId;
        doc.fromGroupName = params.fromGroupName;
    }
    if(params.toGroupId){
        doc.toGroupId = params.toGroupId;
        doc.toGroupName = params.toGroupName;
    }
    if(params.toUserId){
        doc.toUserId = params.toUserId;
        doc.toUserName = params.toUserName;
    }

    db.log.save(doc, function(err, result){
        if(callback){
            callback(err, result && doc);
        }
    });

}



