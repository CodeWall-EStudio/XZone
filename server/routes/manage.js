var http = require('http');
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var config = require('../config');
var ERR = require('../errorcode');
var db = require('../models/db');
var mGroup = require('../models/group');
var mFile = require('../models/file');
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
    var params = req.body;
    var loginUser = req.loginUser;

    if(!U.hasRight(loginUser.auth, config.AUTH_SYS_MANAGER)){
        // 系统管理员才有权限审核小组
        res.json({err: ERR.NOT_AUTH, msg: 'not auth'});
        return;
    }
    delete params.name;
    
    var doc = {
        status: 0,
        validateText: params.validateText || '',//审核评语
        validateStatus: Number(params.validateStatus) || 0, //0 不通过 1 通过
        validateTime: Date.now(),//审核时间
        validator: DBRef('user', ObjectID(loginUser._id))
    };

    mGroup.modify(params, doc, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else if(!doc){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
        }else{
            res.json({ err: ERR.SUCCESS });
        }
    });
}

exports.approveFile = function(req, res){
    var params = req.body;
    var loginUser = req.loginUser;

    if(!U.hasRight(loginUser.auth, config.AUTH_MANAGER)){
        // 系统管理员才有权限审核小组
        res.json({err: ERR.NOT_AUTH, msg: 'not auth'});
        return;
    }
    delete params.name;
    delete params.creator;
    var validateStatus = Number(params.validateStatus) || 0;
    if(validateStatus === 0){
        // 審核不通過的刪除掉
        mFile.delete(params, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else{
                res.json({ err: ERR.SUCCESS });
            }
        });

    }else{
        var doc = {
            status: 0,
            validateText: params.validateText || '',//审核评语
            validateStatus: validateStatus, //0 不通过 1 通过
            validateTime: Date.now(),//审核时间
            validator: DBRef('user', ObjectID(loginUser._id))
        };

        mFile.modify(params, doc, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else if(!doc){
                res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
            }else{
                res.json({ err: ERR.SUCCESS });
            }
        });
    }
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

        mGroup.isPrepareMember(loginUser._id, ep.done('checkRight'));
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

exports.listFiles = function(req, res){
    var loginUser = req.loginUser;
    var params = req.query;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    
    if(U.hasRight(loginUser.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'not auth', ERR.NOT_AUTH);
    }

    db.group.findOne({ type: 0 }, ep.doneLater('getSchoolDone'));

    ep.on('getSchoolDone', function(school){
        if(!school){
            return ep.emit('error', 'system error: no school');
        }
        var query = {
            'group.$id': school._id,
            status: 1
        }
        db.search('file', query, params, function(err, total, docs){
            if(err){
                ep.emit('error', err);
            }else if(total && docs){
                var defProps = { resource: ['_id', 'type', 'size'] , creator: ['_id', 'nick']};
                
                db.dereferences(docs, defProps, function(err, docs){
                    if(err){
                        ep.emit('error', err);
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
    });
}

