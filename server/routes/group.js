var http = require('http');
var EventProxy = require('eventproxy');

var config = require('../config');
var ERR = require('../errorcode');
var mGroup = require('../models/group');

exports.create = function(req, res){
    var params = req.query;
    var uid = req.loginUser._id;
    params.creator = uid;
    var members = params.members || null;
    mGroup.create(params, function(err, group){
        if(err){
            res.json({ err: group || ERR.SERVER_ERROR, msg: err});
        }else{
            var groupId = group._id.toString();

            var ep = new EventProxy();
            var memberCount = (members ? members.length : 0) + 1; 
            ep.after('applyMember', memberCount, function(list){
                res.json({
                    err: ERR.SUCCESS,
                    result: {
                        data: group
                    }
                });
            });

            ep.fail(function(err, errCode){
                res.json({ err: errCode || ERR.SERVER_ERROR, msg: 'add memeber error'})
            });

            mGroup.addUserToGroup({
                uid: uid,
                groupId: groupId,
                auth: 1 // 创建者默认为小组管理员
            }, ep.group('applyMember'));

            if(members){ // 给小组分配成员
                members.forEach(function(member){
                    mGroup.addUserToGroup({
                        uid: member,
                        groupId: groupId,
                        auth: 0
                    }, ep.group('applyMember'));
                });
            }
        }
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
    var params = req.query;

    var doc = {};

    if(params.name){
        doc.name = params.name;
    }
    if(params.content){
        doc.content = params.content;
    }


    mGroup.modify(params.groupId, doc, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else if(!doc){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
        }else{
            res.json({ err: ERR.SUCCESS , result: { data: doc }});
        }
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
            res.json({ err: ERR.SUCCESS , result: { data: doc }});
        }
    });
}