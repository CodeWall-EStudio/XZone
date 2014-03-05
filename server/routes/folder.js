
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;

var config = require('../config');
var ERR = require('../errorcode');
var mFolder = require('../models/folder');
var mGroup = require('../models/group');
var mLog = require('../models/log');
var U = require('../util');
var fileHelper = require('../helper/file_helper');

exports.create = function(req, res){
    var loginUser = req.loginUser;

    var params = req.body;
    var groupId = params.groupId;
    var folderId = params.folderId;
    var name = params.name;

    params.creator = loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    mFolder.getFolder({ 
        name: name,
        'parent.$id': ObjectID(folderId)
    }, function(err, folder){
        if(folder){
            ep.emit('error', 'has the same folder name', ERR.DUPLICATE);
            return;
        }

        // 检查文件夹是否是该用户的, 以及 该用户是否是小组成员
        if(groupId){ // 检查该用户是否是小组成员
            mGroup.isGroupMember(groupId, params.creator, ep.doneLater('checkRight'));

        }else{ // 检查该用户是否是该文件夹所有者
            mFolder.isFolderCreator(folderId, params.creator, ep.doneLater('checkRight'));
        }

    });

    ep.on('checkRight', function(hasRight){
        if(!hasRight){
            ep.emit('error', 'not auth to create folder on this folder', ERR.NOT_AUTH);
            return;
        }

        mFolder.create(params, ep.done('create'));

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
            fromUserId: loginUser._id,
            fromUserName: loginUser.nick,

            folderId: folder._id.toString(),
            folderName: folder.name,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
            //11: delete(移动到回收站) 12: 创建文件夹
            operateType: 12,

            srcFolderId: folderId,
            // distFolderId: params.targetId,
            fromGroupId: folder.group && folder.group.oid.toString()
            // toGroupId: toGroupId
        });
    });

}

exports.get = function(req, res){
    var params = req.query;

    mFolder.getFolder({ _id: ObjectID(params.folderId) }, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: doc
                }
            });
        }
    });
}

exports.modify = function(req, res){
    // 只能修改自己的
    var params = req.body;
    var folderId = params.folderId;
    var loginUser = req.loginUser;
    params.creator = loginUser._id;

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

    mFolder.getFolder({
        _id: ObjectID(folderId)
    }, ep.doneLater('getFolder'));

    ep.on('getFolder', function(folder){
        if(!folder){
            ep.emit('error', 'no such folder', ERR.NOT_FOUND);
            return;
        }
        if(folder.creator.oid.toString() !== params.creator){
            ep.emit('error', 'no allow', ERR.NOT_AUTH);
            return;
        }
        if(params.name){
            if(params.name === folder.name){
                // 名字没变过, 就不要改了
                delete doc.name;
                delete params.name;
                ep.emit('checkName', true);
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
            ep.emit('checkName', true);
        }

    });

    ep.all('getFolder', 'checkName', function(folder, result){
        if(!result){
            ep.emit('error', 'has the same name in this folder', ERR.DUPLICATE);
            return;
        }
        var oldFolderName = folder.name;
        mFolder.modify(params, doc, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else if(!doc){
                res.json({ err: ERR.NOT_FOUND, msg: 'no such folder'});
            }else{
                res.json({ err: ERR.SUCCESS , result: { data: doc }});
                // 记录该操作
                mLog.create({
                    fromUserId: loginUser._id,
                    fromUserName: loginUser.nick,

                    folderId: doc._id.toString(),
                    folderName: oldFolderName,
                    newFolderName: doc.name,

                    //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                    //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
                    //11: delete(移动到回收站) 12: 创建文件夹
                    operateType: 5,

                    srcFolderId: folder.parent._id,
                    // distFolderId: params.targetId,
                    fromGroupId: folder.group && folder.group.oid.toString()
                    // toGroupId: toGroupId
                });
            }
        });
    });

}

function deleteFolder(params, callback){
    // 检查改目录下是否有不是自己的文件, 有就不能删
    // 管理员不受限制
    var ep = new EventProxy();
    ep.fail(callback);

    mFolder.getFolder({
        _id: ObjectID(params.folderId), 
        'creator.$id': ObjectID(params.creator)
    }, ep.doneLater('getFolderSucc'));

    ep.on('getFolderSucc', function(folder){
        if(!folder){
            ep.emit('error', 'no such folder', ERR.NOT_FOUND);
            return;
        }
        if(('deletable' in folder) && !folder.deletable){
            ep.emit('error', 'can not delete this folder', ERR.UNDELETABLE);
            return;
        }
        //TODO 检查是否有不属于自己的文件, 有就不能删
        mFolder.delete(params, callback);
        // if(folder.parent && !folder.parent.oid){
        //     console.log('ugly folder: ', folder);
        // }
        // 记录该操作
        mLog.create({
            fromUserId: params.creator,

            folderId: params.folderId,

            //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
            //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
            //11: delete(移动到回收站) 12: 创建文件夹
            operateType: 6,
            // 这里要用 parent._id, 因为 getFolder 方法把它解开了
            srcFolderId: folder.parent && folder.parent._id && folder.parent._id.toString(),
            // distFolderId: params.targetId,
            fromGroupId: folder.group && folder.group.oid.toString()
            // toGroupId: toGroupId
        });
    });
    
}

exports.delete = function(req, res){
    var params = req.body;
    var folderIds = params.folderId;
    var groupId = params.groupId;
    var loginUser = req.loginUser;
    var creator = loginUser._id;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    ep.after('delete', folderIds.length, function(list){
        res.json({
            err: ERR.SUCCESS,
            result: {
                count: U.calculate(list)
            }
        });
    });

    folderIds.forEach(function(folderId){

        deleteFolder({
            folderId: folderId,
            groupId: groupId,
            creator: creator
        }, ep.group('delete'));


    });

}

exports.list = function(req, res){
    var params = req.query;

    var folderId = params.folderId;
    var groupId = params.groupId || null;

    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    
    // 检查权限
    fileHelper.hasFolderAccessRight(loginUser._id, folderId, groupId, ep.doneLater('checkRight'));

    ep.on('checkRight', function(role){
        if(!role){
            ep.emit('error', 'not auth to search this folder', ERR.NOT_AUTH);
            return;
        }
        if(role === 'creator'){
            params.creator = loginUser._id;
        }

        mFolder.list(params, ep.done('search'));
    });
    ep.on('search', function(total, docs){
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
}

exports.search = function(req, res){
    var params = req.query;

    var folderId = params.folderId;
    var groupId = params.groupId || null;

    var loginUser = req.loginUser;
    
    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    // 检查权限
    fileHelper.hasFolderAccessRight(loginUser._id, folderId, groupId, ep.doneLater('checkRight'));

    ep.on('checkRight', function(role){
        if(!role){
            ep.emit('error', 'not auth to search this folder', ERR.NOT_AUTH);
            return;
        }
        if(role === 'creator'){
            params.creator = loginUser._id;
        }

        mFolder.search(params, ep.done('search'));
    });

    ep.on('search', function(total, docs){
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
}
