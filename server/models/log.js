var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
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
        fromUserId: params.fromUserId && params.fromUserId.toString(),
        fromUserName: params.fromUserName,

        fileId: params.fileId && params.fileId.toString(),
        fileName: params.fileName,

        folderId: params.folderId && params.folderId.toString(),
        folderName: params.folderName,

        operateTime: Date.now(),
        //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
        //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
        //11: delete(移动到回收站) 12: 创建文件夹
        operateType: params.operateType,

        srcFolderId: params.srcFolderId && params.srcFolderId.toString(),
        srcFolderName: params.srcFolderName,

        distFolderId: params.distFolderId && params.distFolderId.toString(),
        distFolderName: params.distFolderName


    };
    if(params.fromGroupId){
        doc.fromGroupId = params.fromGroupId.toString();
        doc.fromGroupName = params.fromGroupName;
    }
    if(params.toGroupId){
        doc.toGroupId = params.toGroupId.toString();
        doc.toGroupName = params.toGroupName;
    }
    if(params.toUserId){
        doc.toUserId = params.toUserId.toString();
        doc.toUserName = params.toUserName;
    }

    db.log.save(doc, function(err, result){
        if(callback){
            callback(err, result && doc);
        }
    });

};

exports.search = function(params, callback){
    
    var query = {};
    if(params.startTime){
        query.operateTime = { $gte: params.startTime };
    }
    if(params.endTime){
        if(!query.operateTime){
            query.operateTime = {};
        }
        query.operateTime['$lte'] = params.endTime;
    }

    if(!params.order){
        params.order = { operateTime: -1 };
    }

    if(params.type){
        query.operateType = { $in: params.type };
    }

	if(params.fromUserId){
		query.fromUserId = params.fromUserId;
	}
	if(params.fromGroupId){
		query.fromGroupId = params.fromGroupId;
	}

	console.log('log/search: ',query);
    db.search('log', query, params, callback);

};

