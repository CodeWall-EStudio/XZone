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
    var params = req.parameter;
    var loginUser = req.loginUser;

    var query = {};

    if('status' in params){
        query.status = params.status;
    }
    if('type' in params){
        query.type = params.type;
    }
    params.extendQuery = query;

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
};

exports.approveGroup = function(req, res){
    var params = req.parameter;
    var group = params.groupId;

    var loginUser = req.loginUser;

    
    var doc = {
        status: 0,
        validateText: params.validateText || '',//审核评语
        validateStatus: Number(params.validateStatus) || 0, //0 不通过 1 通过
        validateTime: Date.now(),//审核时间
        validator: new DBRef('user', loginUser._id)
    };

    mGroup.modify({ _id: group._id }, doc, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else if(!doc){
            res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
        }else{
            res.json({ err: ERR.SUCCESS });
        }
    });
};

exports.approveFile = function(req, res){
    var params = req.parameter;
    var file = params.fileId;

    var loginUser = req.loginUser;
    // 这里的文件只有个人提交到学校的
    var validateStatus = Number(params.validateStatus) || 0;
    if(validateStatus === 0){
        // 審核不通過的刪除掉
        // 这里不用更新学校的空间大小, 文件在没有被审核之前, 是不占空间的
        mFile.delete({ _id: file._id }, { /*updateUsed: true*/ }, function(err/*, doc*/){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else{
                res.json({ err: ERR.SUCCESS });
            }
        });
        return;
    }

    mGroup.getGroup({ type: 0 }, function(err, school){
        if(err){
            return res.json({ err: ERR.SERVER_ERROR, msg: err});
        }

        //这里应该增加学校的空间使用
        mGroup.updateUsed(school._id, file.size, function(){});

        var doc = {
            status: 0,
            validateText: params.validateText || '',//审核评语
            validateStatus: validateStatus, //0 不通过 1 通过
            validateTime: Date.now(),//审核时间
            validator: new DBRef('user', loginUser._id)
        };

        mFile.modify({ _id: file._id }, doc, function(err, doc){
            if(err){
                res.json({ err: ERR.SERVER_ERROR, msg: err});
            }else if(!doc){
                res.json({ err: ERR.NOT_FOUND, msg: 'no such group'});
            }else{
                res.json({ err: ERR.SUCCESS });
            }
        });
    });
};

function fetchGroupMembers(group, callback){
    mGroup.getGroupMembers(group._id, true, function(err, list){
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
            ep.after('fetchGroupMembers', result.length, function(/*list*/){
                callback(null, group);
            });
            ep.fail(function(){
                callback(null, group);
            });
            result.forEach(function(doc){
                fetchGroupMembers(doc, ep.group('fetchGroupMembers'));
            });
        }else{
            callback(null, group);
        }
    });

}

/**
 * 列出所有备课
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.listPrepares = function(req, res){
    // var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });

    db.group.find({
        type: 3, // type=3 是备课小组
        parent: null
    }, ep.done('findGroupsResult'));

    ep.on('findGroupsResult', function(result){
        if(result && result.length){
            ep.after('fetchGroupDetail', result.length, function(/*list*/){
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
};

/**
 * 列出学校的未审核文件
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.listFiles = function(req, res){
    // var loginUser = req.loginUser;
    // var params = req.parameter;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    
    mGroup.getGroup({ type: 0 }, ep.doneLater('getSchoolDone'));

    ep.on('getSchoolDone', function(school){
        if(!school){
            return ep.emit('error', 'system error: no school');
        }
        var query = {
            'group.$id': school._id,
            status: 1
        };

        mFile.search({ extendQuery: query }, ep.done('search'));

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
};

