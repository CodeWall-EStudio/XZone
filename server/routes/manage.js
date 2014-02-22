var http = require('http');
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;

var config = require('../config');
var ERR = require('../errorcode');
var db = require('../models/db');
var mGroup = require('../models/group');
var U = require('../util');

exports.listGroups = function(req, res){
    var params = req.query;
    var loginUser = req.loginUser;

    if(!U.hasRight(loginUser.auth, config.AUTH_SYS_MANAGER)){
        // 系统管理员才有权限审核小组
        res.json({err: ERR.NOT_AUTH, msg: 'not auth'});
        return;
    }

    if(params.status  === 1){
        params.extendQuery = {
            status: 1
        };
    }

    mGroup.search(params, function(err, total, result){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({ err: ERR.SUCCESS , result: { 
                total: total || 0,
                list: result 
            }});
        }
    });

}

exports.approveGroup = function(req, res){
    var params = req.query;
    var loginUser = req.loginUser;

    if(!U.hasRight(loginUser.auth, config.AUTH_SYS_MANAGER)){
        // 系统管理员才有权限审核小组
        res.json({err: ERR.NOT_AUTH, msg: 'not auth'});
        return;
    }

    var doc = {
        status: 0,
        validateText: params.validateText || '',//审核评语
        validateStatus: Number(params.validateStatus) || 0, //0 不通过 1 通过
        validateTime: Date.now(),//审核时间
        validator: DBRef('user', ObjectID(loginUser._id))
    };

    mGroup.modify(params.groupId, doc, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else if(!doc){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
        }else{
            res.json({ err: ERR.SUCCESS });
        }
    });
}

function fetchGroupMembers(group, callback){
    mGroup.getGroupMembers(group._id.toString(), true, function(err, list){
        if(err){
            callback(err);
        }else{
            group.members = list;
            callback(null);
        }
    });

}

function fetchGroupDetail(group, callback){

    db.group.find({ 'parent.$id': group._id }, function(err, result){
        group.list = result;
        if(result && result.length){
            var ep = new EventProxy();
            ep.after('fetchGroupMembers', result.length, function(list){
                callback(null, group);
            });
            ep.fail(function(){
                callback(null, group);
            })
            result.forEach(function(doc){
                fetchGroupMembers(doc, ep.group('fetchGroupMembers'));
            });
        }else{
            callback(null, group);
        }
    });

}

exports.listPrepares = function(req, res){
    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    // 系统管理员 + pt=1的小组的管理员和成员 才有权限
    if(U.hasRight(loginUser.auth, config.AUTH_SYS_MANAGER)){
        ep.emitLater('checkRight', true);
    }else{
        db.group.findOne({
            pt: 1
        }, ep.done('findPtGroup'));

        ep.on('findPtGroup', function(group){
            if(!group){
                console.log('>>>listPrepares, no pt=1 group');
                ep.emitLater('checkRight', false);
            }else{
                mGroup.isGroupMember(group._id.toString(), loginUser._id, ep.done('checkRight'));
            }
        });
    }

    ep.on('checkRight', function(bool){
        if(!bool){
            ep.emit('error', 'not auth', ERR.NOT_AUTH);
            return;
        }
        db.group.find({
            type: 3, // type=3 是备课小组
            parent: null
        }, ep.done('findGroupsResult'));
    });

    ep.on('findGroupsResult', function(result){
        if(result && result.length){
            ep.after('fetchGroupDetail', result.length, function(list){
                ep.emit('fetchGroups', result);
            });
            result.forEach(function(group){
                fetchGroupDetail(group, ep.done('fetchGroupDetail'));
            });
        }else{
            ep.emit('fetchGroups', []);
        }
    });

    ep.on('fetchGroups', function(list){
        res.json({ err: ERR.SUCCESS , result: {
            list: list
        }});
    });
}


