
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var us = require('underscore');

var config = require('../config');
var ERR = require('../errorcode');
var Logger = require('../logger');
var db = require('../models/db');
var mFolder = require('../models/folder');
var mFile = require('../models/file');
var mGroup = require('../models/group');
var mLog = require('../models/log');
var U = require('../util');
var fileHelper = require('../helper/file_helper');

exports.create = function(req, res){
    var loginUser = req.loginUser;

    var parameter = req.parameter;
    // var groupId = params.groupId;
    var folder = parameter.folderId;
    var parentFolder = parameter.folderId;

    // var parentId = parentFolder._id;
    var name = parameter.name;

    var createParams = us.extend({}, parameter);

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    if(parentFolder.__role & config.FOLDER_DEPARTMENT){
        // 继承父文件夹的公开和读写状态
        if(parentFolder.isOpen){
            createParams.isOpen = 1;
        }
        if(parentFolder.isReadonly){
            createParams.isReadonly = 1;
        }
    }

    // 检查重名
    mFolder.getFolder({
        name: name,
        'parent.$id': parentFolder._id
    }, ep.done('checkName'));


    ep.on('checkName', function(fld){
        if(fld){
            ep.emit('error', 'has the same folder name', ERR.DUPLICATE);
            return;
        }

        createParams.creator = loginUser._id;
        createParams.folder = parentFolder;
        if(parentFolder.group){
            createParams.groupId = folder.group.oid;
        }

        mFolder.create(createParams, ep.done('create'));

    });
    
    ep.on('create', function(folder){
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: folder
            }
        });
        // 记录该操作
        mLog.create({
            fromUser: loginUser,

            folder: folder,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
            //11: delete(移动到回收站) 12: 创建文件夹
            operateType: 12,

            srcFolder: parentFolder,

            fromGroupId: parentFolder.group && parentFolder.group.oid


        });
    });

};

exports.get = function(req, res){
    var params = req.parameter;
    var folder = params.folderId;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    Logger.debug('folder.get', folder);

    mFile.countFile({ 'folder.$id': folder._id, del: false }, ep.doneLater('countFile'));

    db.dereference(folder, {'parent': ['_id', 'name'], 'top': ['_id', 'name']}, ep.doneLater('dereference'));

    ep.all('dereference', 'countFile', function(doc, filesCount){

        folder.hasFile = !!filesCount;

        U.removePrivateMethods(folder);

        res.json({
            err: ERR.SUCCESS,
            result: {
                data: folder
            }
        });
    });
    
};

exports.modify = function(req, res){
    // 只能修改自己的
    var params = req.parameter;
    var folder = params.folderId;
    var loginUser = req.loginUser;


    var doc = {};
    if(params.mark){
        doc.mark = params.mark;
    }
    if(params.name){
        doc.name = params.name;
    }

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.on('checkName', function(result){
        if(!result){
            ep.emit('error', 'has the same name in this folder', ERR.DUPLICATE);
            return;
        }
        Logger.info('folder/modify checkName ok');
        var oldFolderName = folder.name;
        // params.folderId = folder._id;

        mFolder.modify({ _id: folder._id }, doc, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else {
                res.json({ err: ERR.SUCCESS , result: { data: doc }});
                
                // 记录该操作
                mLog.create({
                    fromUser: loginUser,

                    folder: doc,
                    oldFolderName: oldFolderName,


                    //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                    //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
                    //11: delete(移动到回收站) 12: 创建文件夹
                    operateType: 5,

                    srcFolderId: folder.parent.oid,

                    fromGroupId: folder.group && folder.group.oid
                });

            }
        });
    });

    if(params.name){
        if(params.name === folder.name){
            // 名字没变过, 就不要改了
            delete doc.name;
            delete params.name;
            ep.emitLater('checkName', true);
            return;
        }
        mFolder.getFolder({
            name: params.name,
            'parent.$id': folder.parent._id
        }, function(err, doc){
            if(doc){
                ep.emit('checkName', false);
            }else{
                ep.emit('checkName', true);
            }
        });
    }else{
        ep.emitLater('checkName', true);
    }

};

function deleteFolder(loginUser, folder, callback){
    // 检查改目录下是否有不是自己的文件, 有就不能删
    // 管理员不受限制

    if(('deletable' in folder) && !folder.deletable){
        callback('can not delete this folder', ERR.UNDELETABLE);
        return;
    }

    //检查是否有不属于自己的文件, 有就不能删
    var searchParams = {

        recursive: true,
        folderId: folder._id,
        extendQuery: {
            'creator.$id': { $ne: loginUser._id }
        }
    };

    mFile.search(searchParams, function(err, total, docs){
        if(err){
            return callback(err);
        }
        // ROLE_FOLDER_MANAGER === 系统管理员 | 超级管理员 | 小组管理员 | 部门管理员
        if(total && !(folder.__user_role & config.ROLE_FOLDER_MANAGER)){
            return callback('there are some files create by another', ERR.NOT_EMPTY);
        }

        mFolder.delete({ folder: folder } , callback);

        // 记录该操作
        mLog.create({
            fromUser: loginUser,

            folder: folder,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
            //11: delete(移动到回收站) 12: 创建文件夹
            operateType: 6,

            srcFolderId: folder.parent && folder.parent.oid,

            fromGroupId: folder.group && folder.group.oid

        });
    });
}

exports.delete = function(req, res){
    var params = req.parameter;
    var folders = params.folderId;
    // var groupId = params.groupId;
    var loginUser = req.loginUser;
    // var creator = loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('delete', folders.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                count: U.calculate(list)
            }
        });
    });

    folders.forEach(function(folder){

        deleteFolder(loginUser, folder, ep.group('delete'));

    });
};

exports.list = function(req, res){
    var params = req.parameter;

    var folder = params.folderId;
	var creator = params.creatorId;
    // var groupId = params.groupId || null;

    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    
    params.folderId = folder._id;
    params.isDeref = true;
	
    if(creator){
        params.creator = creator._id;
	}else if(folder.__role & config.FOLDER_PRIVATE){
        // 个人空间搜索, 搜索自己创建的文件
        params.creator = loginUser._id;
    }else if((folder.__role & config.FOLDER_DEPARTMENT) && (loginUser.__role & config.ROLE_VISITOR)){
        // 不是部门文件夹的授权访问者, 就只能看公开文件夹
        // 
        params.extendQuery = {// 公開文件夾可以搜索文件夾, 非公開就不返回內容
            isOpen: true
        };
    }

    mFolder.search(params, ep.done('search'));

    ep.on('search', function(total, docs){
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
};

exports.search = function(req, res){
    var params = req.parameter;

    var folder = params.folderId;
    var creator = params.creatorId;

    var loginUser = req.loginUser;
    
    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    params.folderId = folder._id;
    params.isDeref = true;
    params.recursive = true;

    if(creator){
        params.creator = creator._id;
    }else if(folder.__role & config.FOLDER_PRIVATE){
        // 个人空间搜索, 搜索自己创建的文件
        params.creator = loginUser._id;
    }else if((folder.__role & config.FOLDER_DEPARTMENT) && (loginUser.__role & config.ROLE_VISITOR)){
        // 不是文件夹的授权访问者, 就只能看 公开文件夹
        params.extendQuery = {// 公開文件夾可以搜索文件夾, 非公開就不返回內容
            isOpen: true
        };
    }
    
    mFolder.search(params, ep.done('search'));

    ep.on('search', function(total, docs){
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
};


function statisticsFolder(folder, callback){

    var ep = new EventProxy();
    ep.fail(callback);

    mFolder.statistics(folder._id, {}, ep.doneLater('statFolder'));

    mFile.statistics(folder._id, { ignoreDel: true }, ep.doneLater('statFile'));

    ep.all('statFolder', 'statFile', function(folderResult, fileResult){

        var result = folderResult;
        result.fileStat = fileResult;
        result.folderId = folder._id;

        callback(null, result);

    });

}

/**
 * 统计文件夹个数
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.statistics = function(req, res){
    var parameter = req.parameter;
    var folder = parameter.folderId;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        return res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    statisticsFolder(folder, ep.doneLater('statisticsFolder'));

    ep.on('statisticsFolder', function(result){

        res.json({
            err: ERR.SUCCESS,
            result: result
        });

    });

};

exports.batchStatistics = function(req, res){
    var parameter = req.parameter;
    var folders = parameter.folderId;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        return res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('statisticsFolder', folders.length, function(list){

        res.json({
            err: ERR.SUCCESS,
            list: list
        });

    });

    folders.forEach(function(folder){
        statisticsFolder(folder, ep.group('statisticsFolder'));
    });

};