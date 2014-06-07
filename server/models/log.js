var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var us = require('underscore');

var db = require('./db');
var ERR = require('../errorcode');
var U = require('../util');
var Logger = require('../logger');

//操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
//6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
//11: delete(移动到回收站) 12: 创建文件夹
var OPERATE_TYPE_NAME = {
    1: '上传文件',
    2: '下载文件',
    3: '复制文件/文件夹',
    4: '移动文件/文件夹',
    5: '修改文件/文件夹',
    6: '删除文件/文件夹',
    7: '预览文件',
    8: '保存文件',
    9: '分享文件给用户',
    10: '分享文件给小组/部门',
    11: '移动文件到回收站',
    12: '创建文件夹'
};

exports.create = function(params, callback) {

    var ep = new EventProxy();
    ep.fail(callback);

    var arr = [ // 这里是为了减少重复的类似的代码
        ['fromUser', 'user', 'fromUserId', 'fromUserName'],
        ['toUser', 'user', 'toUserId', 'toUserName'],

        ['file', 'file', 'fileId', 'fileName'], // 这里指被操作的文件
        ['folder', 'folder', 'folderId', 'folderName'], // 这里指被操作的文件夹

        ['srcFolder', 'folder', 'srcFolderId', 'srcFolderName'],
        ['distFolder', 'folder', 'distFolderId', 'distFolderName'],

        ['fromGroup', 'group', 'fromGroupId', 'fromGroupId'],
        ['toGroup', 'group', 'toGroupId', 'fromGroupName']

    ];

    ep.all('fromUser', 'toUser', 'file', 'folder',
        'srcFolder', 'distFolder', 'fromGroup', 'toGroup',
        function(fromUser, toUser, file, folder, srcFolder, distFolder, fromGroup, toGroup) {

            var doc = {
                operateTime: Date.now(),

                //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
                //11: delete(移动到回收站) 12: 创建文件夹
                operateType: params.operateType,
                operateName: OPERATE_TYPE_NAME[params.operateType] || '未命名操作',

                oldFileName: params.oldFileName, // 重命名的时候会传
                oldFolderName: params.oldFolderName
            };

            var argus = arguments;
            arr.forEach(function(item, i) {
                var key = item[0],
                    collName = item[1],
                    collKey = item[2],
                    collKeyName = item[3];
                var data = argus[i];

                // doc[key] = data;
                doc[collKey] = data ? data._id.toString() : params[collKey];
                doc[collKeyName] = data ? (data.nick || data.name) : params[collKeyName];

            });

            if (file) {
                doc.fileType = file.type;
                doc.fileSize = file.size;
            }


            if (fromGroup) {
                doc.fromGroupType = fromGroup.type;
            }

            Logger.debug('[log] create: ', doc);
            db.log.save(doc, function(err, result) {
                if (callback) {
                    callback(err, result && doc);
                }
            });

        });

    arr.forEach(function(item) {
        var key = item[0],
            collName = item[1],
            collKey = item[2];

        if (params[key]) {
            ep.emitLater(key, params[key]);
        } else if (params[collKey]) {
            db[collName].findOne({
                _id: params[collKey]
            }, ep.doneLater(key));
        } else {
            ep.emitLater(key, null);
        }

    });


};

exports.search = function(params, callback) {

    var query = {};
    if (params.startTime) {
        query.operateTime = {
            $gte: params.startTime
        };
    }
    if (params.endTime) {
        if (!query.operateTime) {
            query.operateTime = {};
        }
        query.operateTime['$lte'] = params.endTime;
    }

    if (!params.order) {
        params.order = {
            operateTime: -1
        };
    }

    if (params.type) {
        query.operateType = {
            $in: params.type
        };
    }

    if (params.fileName) {
        query.fileName = new RegExp('.*' + U.encodeRegexp(params.fileName) + '.*');
    }

    if (params.fromUserId) {
        query.fromUserId = params.fromUserId;
    }
    if (params.fromGroupId) {
        query.fromGroupId = params.fromGroupId;
    }
    if ('fromGroupType' in params) {
        query.fromGroupType = params.fromGroupType;
    }

    console.log('log/search: ', query);
    db.search('log', query, params, callback);

};