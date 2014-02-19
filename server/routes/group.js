var http = require('http');
var EventProxy = require('eventproxy');
var us = require('underscore');

var config = require('../config');
var U = require('../util');
var ERR = require('../errorcode');
var mGroup = require('../models/group');

exports.create = function(req, res){
    var params = req.body;

    params.creator = req.loginUser._id;

    if(U.hasRight(req.loginUser.auth, config.AUTH_MANAGER)){
        params.status = 0; // 管理员以上创建小组不用审核
    }else{
        delete params.status;
    }
    // console.log(req.loginUser.auth, config.AUTH_MANAGER, U.hasRight(req.loginUser.auth, config.AUTH_MANAGER));

    var members = params.members || [];
    members.push(params.creator);
    members = us.uniq(members); // 唯一化, 防止出现两个相同的用户

    var ep = new EventProxy();

    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    mGroup.create(params, ep.doneLater('create'));

    ep.on('create', function(group){
        var groupId = group._id.toString();

        ep.after('applyMember', members.length, function(list){
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: group
                }
            });
        });
        members.forEach(function(member){
            // 创建者默认为小组管理员
            var auth = member === params.creator ? config.AUTH_GROUP_MANAGER : config.AUTH_USER;

            mGroup.addUserToGroup({
                userId: member,
                groupId: groupId,
                auth: auth
            }, ep.group('applyMember'));
        });
        
    });
}

exports.list = function(req, res){
    var params = req.query;

    var userId = req.loginUser._id;

    mGroup.getGroupByUser(userId, function(err, docs){
        if(err){
            res.json({ err: docs || ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    list: docs
                }
            });
        }

    });
}

exports.modify = function(req, res){
    var params = req.body;
    var loginUser = req.loginUser;

    var doc = {};

    if(params.name){
        doc.name = params.name;
    }
    if(params.content){
        doc.content = params.content;
    }

    var ep = new EventProxy();

    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    mGroup.getGroup(params.groupId, ep.doneLater('getGroup'));

    ep.on('getGroup', function(group){
        if(!group){
            ep.emit('error', 'no such group', ERR.NOT_FOUND);
            return;
        }
        if(U.hasRight(loginUser.auth, config.AUTH_MANAGER)){
            // 当前用户是管理员或者系统管理员
            ep.emit('ready');
        }else{
            mGroup.isGroupMember(params.groupId, loginUser._id, ep.done('checkAuth'));
        }
    });

    ep.on('checkAuth', function(result, doc){
        if(result && U.hasRight(doc.auth, config.AUTH_GROUP_MANAGER)){
            ep.emit('ready')
        }else{
            ep.emit('error', 'not auth to modify this group', ERR.NOT_AUTH);
        }
    });

    ep.on('ready', function(){
        mGroup.modify(params.groupId, doc, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else if(!doc){
                res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
            }else{
                res.json({ err: ERR.SUCCESS , result: { data: doc }});
            }
        });
    });// ready
}

exports.get = function(req, res){
    var params = req.query;

    mGroup.getGroup(params.groupId, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else if(!doc){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
        }else{
            mGroup.getGroupMembers(params.groupId, true, function(err, members){
                doc.members = members;
                res.json({ err: ERR.SUCCESS , result: { data: doc }});
            });
        }
    });
}