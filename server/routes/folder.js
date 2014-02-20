
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;

var config = require('../config');
var ERR = require('../errorcode');
var mFolder = require('../models/folder');
var mGroup = require('../models/group');

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
    
    ep.on('create', function(doc){
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: doc
            }
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

    params.creator = req.loginUser._id;

    var doc = {};
    if(params.mark){
        doc.mark = params.mark;
    }
    if(params.name){
        doc.name = params.name;
    }

    var ep = new EventProxy();
    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });

    mFolder.getFolder({
        _id: ObjectID(folderId)
    }, ep.doneLater('getFolder'));

    ep.on('getFolder', function(folder){
        if(!folder){
            ep.emit('error', 'no such folder', ERR.NOT_FOUND);
            return;
        }
        if(params.name){
            mFolder.getFolder({
                name: params.name,
                'parent.$id': folder.parent.oid
            }, function(err, doc){
                if(doc){
                    ep.emit('checkName', false);
                }else{
                    ep.emit('checkName', true);
                }
            }
        }else{
            ep.emit('checkName', true);
        }

    });

    ep.on('checkName', function(result){
        if(!result){
            ep.emit('error', 'has the same name in this folder', ERR.DUPLICATE);
            return;
        }
        mFolder.modify(params, doc, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else if(!doc){
                res.json({ err: ERR.NOT_FOUND, msg: 'no such folder'});
            }else{
                res.json({ err: ERR.SUCCESS , result: { data: doc }});
            }
        });
    });

}



exports.delete = function(req, res){
    var params = req.body;
    var folderIds = params.folderId;
    var groupId = params.groupId;

    var creator = req.loginUser._id;

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

        //TODO 检查是否有不属于自己的文件, 有就不能删
        mFolder.delete({
            folderId: folderId,
            groupId: groupId,
            creator: creator
        }, ep.group('delete'));
    });

}

exports.list = function(req, res){
    var params = req.query;
    // params.creator = req.loginUser._id;
    
    mFolder.list(params, function(err, docs){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    total: docs ? docs.length : 0,
                    list: docs
                }
            });
        }
    });
}

exports.search = function(req, res){
    var params = req.query;

    var folderId = params.folderId;
    var groupId = params.groupId || null;

    params.creator = req.loginUser._id;
    
    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    // 检查文件夹是否是该用户的, 以及 该用户是否是小组成员
    if(groupId){ // 检查该用户是否是小组成员
        mGroup.isGroupMember(groupId, params.creator, ep.doneLater('checkRight'));

    }else{ // 检查该用户是否是该文件夹所有者
        mFolder.isFolderCreator(folderId, params.creator, ep.doneLater('checkRight'));
    }

    ep.on('checkRight', function(hasRight){
        if(!hasRight){
            ep.emit('error', 'not auth to search this folder', ERR.NOT_AUTH);
            return;
        }
        if(groupId){
            delete params.creator;
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
