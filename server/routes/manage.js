var http = require('http');
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;

var config = require('../config');
var ERR = require('../errorcode');
var db = require('../models/db');
var mGroup = require('../models/group');

exports.listGroups = function(req, res){
    var params = req.query;

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

    var ep = new EventProxy();

    ep.on('fetchGroups', function(list){
        res.json({ err: ERR.SUCCESS , result: {
            list: list
        }});
    });

    ep.fail(function(err){
        res.json({ err: ERR.SERVER_ERROR, msg: err});
    });
    // TODO buggy
    db.group.find({
        type: 3, // type=3 是备课小组
        parent: null
    }, function(err, result){
        if(err){
            ep.emit('error');
        }else if(result && result.length){
            ep.after('fetchGroupDetail', result.length, function(list){
                ep.emit('fetchGroups', result);
            });
            ep.fail(function(){
                ep.emit('fetchGroups', result);
            });
            result.forEach(function(group){
                fetchGroupDetail(group, ep.done('fetchGroupDetail'));
            });
        }
    });
}

// exports.searchFiles = function(req, res){
//     var params = req.query;

//     mFile.search(params, function(err, total, docs){
//         if(err){
//             res.json({ err: ERR.SERVER_ERROR, msg: err});
//         }else{
//             res.json({
//                 err: ERR.SUCCESS,
//                 result: {
//                     total: total,
//                     list: docs
//                 }
//             });
//         }
//     });
// }

