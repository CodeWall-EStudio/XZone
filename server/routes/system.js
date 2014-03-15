var http = require('http');
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var config = require('../config');
var ERR = require('../errorcode');
var db = require('../models/db');
var group = require('../models/group');
var U = require('../util');
var userHelper = require('../helper/user_helper');
var mUser = require('../models/user');


function createDepart(parent, dep, callback){
    var ep = new EventProxy();
    ep.fail(callback);

    if(dep.classes === 'department'){
        db.department.save({
            openid: dep.id,
            name: dep.title,
            parent: DBRef('department', parent._id)
        }, ep.doneLater('save'));

        ep.on('save', function(doc){
            console.log('create department', doc.name);
            if(!dep.children){
                return callback(null);
            }
            ep.after('createDepartDone', dep.children.length, function(){
                callback(null);
            });

            dep.children.forEach(function(dep){
                createDepart(doc, dep, ep.group('createDepartDone'));
            });

        });
    }else if(dep.classes === 'user'){

        var openid = dep.id;
        var loginName = dep.loginName;
        var nick = dep.name;

        // 先用 openid 查查有没有该用户
        db.user.findOne({ openid: openid }, function(err, user){
            if(user){ // db已经有该用户, 更新资料
                user.nick = nick;
                user.name = loginName;
                db.user.save(user, ep.done('updateUserSuccess'));
            }else{
                user = {
                    openid: openid,
                    nick: nick,
                    name: loginName,
                    auth: 0, // 15 是管理员
                    size: config.DEFAULT_USER_SPACE,
                };
                mUser.create(user, ep.done('updateUserSuccess'));
            }
        });

        ep.on('updateUserSuccess', function(user){
            console.log('create user', user.name);
            // 把用户跟部门关联
            db.departuser.save({
                department: DBRef('department', parent._id),
                user: DBRef('user', user._id)
            }, callback);
        });
    }
}

exports.initGroups = function(req,res){
    
    var param = {
        name : '教学处',
        status : 0,
        type : 2,
        pt : 1
    }
    group.create(param,function(){
        console.log('教学处创建完成');
    });

   var param = {
        name : '学校空间',
        status : 0,
        type : 0,
    }
    group.create(param,function(){
        console.log('学校空间创建完成');
    }); 

}

// 初始化学校的部门架构
exports.initDeparts = function(req, res){
    var skey = req.skey;
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!U.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }

    db.department.findOne({ parent: null }, ep.doneLater('getSchoolDep')); 

    ep.on('getSchoolDep', function(root){
        if(root){
            return ep.emit('error', 'already init!!!!');
        }     

        userHelper.getOrgTree(skey, user.name, ep.done('getOrgTree')); 
    });

    ep.on('getOrgTree',  function(data){
        if(data.success){
            var root = data.departmentTree;
            db.department.save({
                openid: root.id,
                name: root.title
            }, function(err, doc){
                if(err){
                    return ep.emit('error', err);
                }
                ep.after('createDepDone', root.children.length, function(){
                    res.json({ err: ERR.SUCCESS });
                });

                root.children.forEach(function(dep){
                    createDepart(doc, dep, ep.group('createDepDone'));
                });
            });
            return;
        }
        ep.emit('error', err);
    });

}

// 合并旧的用户数据
exports.mergeOldData = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!U.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }

    db.user.find({ openid: null }, function(err, users){
        if(err){
            return ep.emit('error', err);
        }
        ep.after('mergeDone', users.length, function(){
            res.json({ err: ERR.SUCCESS });
        });

        users.forEach(function(oldUser){

            db.user.findOne({ name: oldUser.name, openid: { $exists: true } }, 
                    function(err, user){

                if(err){
                    return ep.emit('error', err);
                }
                if(user){
                    db.departuser.update({ _id: user._id }, {$set: { user: DBRef('user', oldUser._id) }}, function(){
                        console.log('change departuser,', oldUser.name);
                    });

                    user = us.extend(user, oldUser);

                    db.user.save(user, ep.group('mergeDone'));

                }else{
                    ep.emit('mergeDone');
                }
            });
        });

    });
}


