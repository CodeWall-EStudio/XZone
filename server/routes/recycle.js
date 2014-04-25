var EventProxy = require('eventproxy');
var us = require('underscore');

// var config = require('../config');
var ERR = require('../errorcode');
var mLog = require('../models/log');
var mFile = require('../models/file');


exports.delete = function(req, res){
    var params = req.parameter;

    var files = params.fileId;
    var group = params.groupId;

    var loginUser = req.loginUser;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    ep.after('delete', files.length, function(){
        res.json({
            err: ERR.SUCCESS
        });
    });

    var options = {
        groupId: group && group._id,
        updateUsed: true
    };

    files.forEach(function(file){
        mFile.delete({ _id: file._id }, options, ep.group('delete', function(result){
            // 记录该操作
            mLog.create({
                fromUserId: loginUser._id,
                fromUserName: loginUser.nick,

                fileId: file._id,
                fileName: file.name,

                //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
                //11: delete(移动到回收站) 12: 创建文件夹
                operateType: 6,
                // 这里要用 parent._id, 因为 getFolder 方法把它解开了
                srcFolderId: file.folder && file.folder._id,
                // distFolderId: params.targetId,
                fromGroupId: file.folder && file.folder.group && file.folder.group.oid
                // toGroupId: toGroupId
            });
            return result;
        }));
    });

};

exports.revert = function(req, res){

    var params = req.parameter;

    var files = params.fileId;

    // var loginUser = req.loginUser;

    var ep = new EventProxy();

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    ep.after('revert', files.length, function(){
        res.json({
            err: ERR.SUCCESS
        });
    });

    files.forEach(function(file){

        mFile.modify({ _id: file._id }, { del: false }, ep.group('revert'));
    });
};


exports.search = function(req, res){
    var parameter = req.parameter;
    var loginUser = req.loginUser;
    var group = parameter.groupId;

    var searchParams = us.extend({}, parameter);

    searchParams.extendQuery = {
        del: true
    };

    delete searchParams.groupId;

    if (group) {

        // 搜索小组的回收站
        searchParams.folderId = group.rootFolder.oid;
        searchParams.recursive = true;
    } else {

        // 只能搜索自己的回收站
        searchParams.creator = loginUser._id;
    }

    mFile.search(searchParams, function(err, total, docs){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    total: total,
                    list: docs
                }
            });
        }
    });
};