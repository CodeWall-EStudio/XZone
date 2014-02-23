var http = require('http');
var EventProxy = require('eventproxy');
var us = require('underscore');

var config = require('../config');
var U = require('../util');
var ERR = require('../errorcode');
var db = require('../models/db');
var mGroup = require('../models/group');

exports.create = function(req, res){
    var params = req.body;

    params.creator = req.loginUser._id;

    if(U.hasRight(req.loginUser.auth, config.AUTH_MANAGER)){
        params.status = 0; // 管理员以上创建小组不用审核
    }else{
        delete params.status;
    }


    var members = params.members || [];
    var managers = params.managers || [];
    managers.push(params.creator);
    
    members = members.concat(managers);
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

            var auth = config.AUTH_USER;
            if(managers.indexOf(member) > -1){
                auth = config.AUTH_GROUP_MANAGER;
            }

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
    var groupId = params.groupId;

    var doc = {};

    if(params.name){ // 要检查重名
        doc.name = params.name;
    }
    if(params.content){
        doc.content = params.content;
    }
    
    var members = params.members || [];
    var managers = params.managers || [];


    // 修改成员
    members = members.concat(managers);
    members = us.uniq(members); // 唯一化


    var ep = new EventProxy();

    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });


    mGroup.getGroup(groupId, ep.doneLater('getGroup'));

    ep.on('getGroup', function(group){
        if(!group){
            ep.emit('error', 'no such group', ERR.NOT_FOUND);
            return;
        }
        if(doc.name && doc.name === group.name){
            // 名字没变过, 就不写了
            delete doc.name;
        }
        if(U.hasRight(loginUser.auth, config.AUTH_MANAGER)){
            // 当前用户是管理员或者系统管理员
            ep.emit('ready');
        }else{
            mGroup.isGroupMember(groupId, loginUser._id, ep.done('checkAuth'));
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

        mGroup.modify(params, doc, ep.done('modifySuccess'));

        mGroup.getGroupMemberIds(groupId, ep.done('getMemberIds'));

    });// ready

    ep.all('getGroup', 'getMemberIds', function(group, docs){
        var creator = group.creator.oid.toString();
        if(!docs.length){// 没有的话所有 memebers都是新增的
            if(!members.length){
                ep.emit('modifyMemberSuccess');
                return;
            }
            
            ep.after('applyMember', members.length, function(list){
                ep.emit('modifyMemberSuccess');
            });
            members.forEach(function(userId){

                var auth = config.AUTH_USER;
                if(managers.indexOf(userId) > -1){
                    auth = config.AUTH_GROUP_MANAGER;
                }
                mGroup.addUserToGroup({
                    userId: userId,
                    groupId: groupId,
                    auth: auth
                }, ep.group('applyMember'));

                console.log('>>>modify group add member[all]', userId);
            });
            
        }else{
            ep.after('modifyMember', docs.length, function(list){
                if(members.length){// 如果 members 还有数据, 说明有新增用户
                    ep.after('applyMember', members.length, function(list){
                        ep.emit('modifyMemberSuccess');
                    });
                    members.forEach(function(userId){

                        var auth = config.AUTH_USER;
                        if(managers.indexOf(userId) > -1){
                            auth = config.AUTH_GROUP_MANAGER;
                        }
                        mGroup.addUserToGroup({
                            userId: userId,
                            groupId: groupId,
                            auth: auth
                        }, ep.group('applyMember'));

                        console.log('>>>modify group add member', userId);
                    });
                }else{ //没有的话就处理完了
                    ep.emit('modifyMemberSuccess');
                }
            });

            docs.forEach(function(doc){
                var userId = doc.user.oid.toString();
                var mIndex = members.indexOf(userId);
                if(mIndex === -1){
                    //防止创建者被删掉
                    if(creator === userId){
                        ep.emit('modifyMember');
                        console.log('>>>modify group can not remove creator', userId);
                    }else{
                        // 这个用户被删了
                        mGroup.removeUserFromGroup({
                            userId: userId,
                            groupId: groupId
                        }, ep.group('modifyMember'));
                        console.log('>>>modify group remove member', userId);
                    }
                    
                }else{
                    // 这次可能被修改了权限的用户
                    var auth = config.AUTH_USER;
                    if(managers.indexOf(userId) > -1){
                        auth = config.AUTH_GROUP_MANAGER;
                    }
                    mGroup.modifyUserAuth({
                        userId: userId,
                        groupId: groupId,
                        auth: auth
                    }, ep.group('modifyMember'));
                    // 从 members 里删除
                    members.splice(mIndex, 1);
                    console.log('>>>modify group change member auth', userId, auth);
                }
            });
        }
    });


    ep.all('modifySuccess', 'modifyMemberSuccess', function(doc){

        db.dereference(doc, { rootFolder: null }, function(){
            res.json({ err: ERR.SUCCESS , result: { data: doc }});
        });
    });
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