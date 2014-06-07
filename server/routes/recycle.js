var EventProxy = require('eventproxy');
var us = require('underscore');

// var config = require('../config');
var ERR = require('../errorcode');
var mLog = require('../models/log');
var mFile = require('../models/file');
var mFolder = require('../models/folder');
var mGroup = require('../models/group');


exports.delete = function(req, res) {
    var params = req.parameter;

    var files = params.fileId;
    var group = params.groupId;

    var loginUser = req.loginUser;

    var ep = new EventProxy();

    ep.fail(function(err) {
        res.json({
            err: ERR.SERVER_ERROR,
            msg: err
        });
    });

    ep.after('delete', files.length, function() {
        res.json({
            err: ERR.SUCCESS
        });
    });

    var options = {
        groupId: group && group._id,
        updateUsed: true
    };

    files.forEach(function(file) {
        mFile.delete({
            _id: file._id
        }, options, ep.group('delete', function(result) {

            mLog.create({
                fromUser: loginUser,

                file: file,

                //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
                //11: delete(移动到回收站) 12: 创建文件夹
                operateType: 6,

                srcFolderId: file.folder && file.folder.oid,

                fromGroupId: file.folder && file.folder.group && file.folder.group.oid

            });
            return result;
        }));
    });

};


function revertFile(user, file, callback) {

    // 检查源目录是否存在, 不存在则放在用户根目录
    mFolder.getFolder({
        _id: file.folder.oid
    }, function(err, folder) {
        if (err) {
            return callback(err);
        }
        var folderId = null;
        if (folder) {
            folderId = folder._id;
        } else {
            folderId = user.rootFolder.oid;
        }

        mFile.modify({
            _id: file._id
        }, {
            del: false,
            'folder.$id': folderId
        }, function(err) {
            if (err) {
                return callback(err);
            }
            if (folderId === user.rootFolder.oid){
                callback(null, { code: 1, msg: 'revert to rootFolder'}); // 1 表示源文件夹已经被删, 还原到了根目录
            } else {
                callback(null, { code: 0, msg: 'success' });
            }
        });
    });

}

exports.revert = function(req, res) {

    var params = req.parameter;

    var files = params.fileId;

    var loginUser = req.loginUser;

    var ep = new EventProxy();

    ep.fail(function(err) {
        res.json({
            err: ERR.SERVER_ERROR,
            msg: err
        });
    });

    ep.after('revert', files.length, function(list) {
        res.json({
            err: ERR.SUCCESS,
            result: {
                list: list
            }
        });
    });

    files.forEach(function(file) {

        revertFile(loginUser, file, ep.group('revert'));

    });
};


exports.search = function(req, res) {
    var parameter = req.parameter;
    var loginUser = req.loginUser;
    var group = parameter.groupId;

    var searchParams = us.extend({}, parameter);

    searchParams.extendQuery = {
        del: true
    };
    searchParams.isDeref = true;

    delete searchParams.groupId;

    if (group) {

        // 搜索小组的回收站
        searchParams.folderId = group.rootFolder.oid;
        searchParams.recursive = true;
    } else {

        // 只能搜索自己的回收站
        searchParams.creator = loginUser._id;
    }

    mFile.search(searchParams, function(err, total, docs) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        } else {
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