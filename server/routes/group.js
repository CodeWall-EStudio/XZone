var EventProxy = require('eventproxy');
var us = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;

var config = require('../config');
var U = require('../util');
var Logger = require('../logger');
var ERR = require('../errorcode');
var db = require('../models/db');
var mGroup = require('../models/group');
var mSizegroup = require('../models/sizegroup');

function checkStartEndTime(params, callback) {
    var startTime = params.startTime;
    var endTime = params.endTime;
    var groupId = params.groupId;

    if (endTime < startTime) {
        return callback('endTime must greater than startTime', ERR.PARAM_ERROR);
    }
    // 学年时间不能交叉
    // [] db, () input,   1:([])  2: [()] 3: ([)]  4: [(])   ()[]  []()
    mGroup.getGroup({
        $or: [{
            startTime: {
                $gte: startTime
            }, // 1 输入的时间的包括了某个学期
            endTime: {
                $lte: endTime
            }
        }, {
            startTime: {
                $lte: startTime
            }, // 2 输入的时间的被某个学期包括了
            endTime: {
                $gte: endTime
            }
        }, {
            startTime: {
                $gte: startTime,
                $lt: endTime
            }, // 3 输入的时间的与某个学期的前半部分交叉了
            endTime: {
                $gte: endTime
            }
        }, {
            startTime: {
                $lte: startTime
            }, // 4 输入的时间的与某个学期的后半部分交叉了
            endTime: {
                $gt: startTime,
                $lte: endTime
            }
        }, ]
    }, function(err, group) {
        if (err) {
            return callback(err, group);
        }
        if (group) {
            if(groupId && group._id.toString() === groupId.toString()){

            }else{
                return callback('group time cross with ' + group.name + '( ' + group._id + ' )', ERR.TIME_DUPLICATE);
            }
            
        }
        callback(null);
    });
}



exports.create = function(req, res) {
    var parameter = req.parameter;
    var loginUser = req.loginUser;

    var name = parameter.name;
    // var type = parameter.type;
    // var content = parameter.content;
    var parent = parameter.parentId;
    var members = parameter.members || [];
    var managers = parameter.managers || [];
    var sizegroup = parameter.sizegroupId;
    var startTime = parameter.startTime;
    var endTime = parameter.endTime;

    var createParams = us.extend({}, parameter);

    var ep = new EventProxy();
    ep.fail(function(err, errCode) {
        res.json({
            err: errCode || ERR.SERVER_ERROR,
            msg: err
        });
    });

    // 小组的名字在同一个group下要唯一
    var nameQuery = {
        name: name
    };
    if (parent) {
        nameQuery['parent.$id'] = parent._id;
    } else {
        nameQuery['parent.$id'] = null;
    }
    mGroup.getGroup(nameQuery, ep.doneLater('getGroup'));

    if (sizegroup) {

        ep.emitLater('getSizegroup', sizegroup);
    } else {

        // 如果没有传 size , 就用默认的 size
        mSizegroup.getSizegroup({
            type: 1,
            isDefault: true
        }, ep.done('getSizegroup'));
    }

    if (startTime && endTime) {

        checkStartEndTime({
            startTime: startTime,
            endTime: endTime
        }, function(err, errCode) {
            if (err) {
                return ep.emit('error', err, errCode);
            }
            ep.emit('checkTime');
        });
    } else {
        ep.emitLater('checkTime');
    }

    ep.all('getGroup', 'getSizegroup', 'checkTime', function(group, sizegroup) {
        if (group) {
            return ep.emit('error', 'name duplicate with ' + group._id, ERR.DUPLICATE);
        }
        Logger.debug('create group use default sizegroup: ', sizegroup);
        if (sizegroup) {
            createParams.sizegroupId = sizegroup._id;
            createParams.size = sizegroup.size;
        }
        if (loginUser.__role & config.ROLE_MANAGER) {
            createParams.status = 0; // 管理员以上创建小组不用审核
        } else {
            delete createParams.status;
        }

        if (parent) {
            createParams.parentId = parent._id;
        }
        createParams.creator = loginUser._id;

        createParams.size = createParams.size || config.DEFAULT_USER_SPACE || 0;

        mGroup.create(createParams, ep.doneLater('createGroup'));

    });

    ep.on('createGroup', function(group) {

        // 创建者默认为小组管理员
        managers.push(loginUser);
        // 把 object 提取出 字符串的 _id
        managers = us.map(managers, function(user) {
            return user._id.toString();
        });
        members = us.map(members, function(user) {
            return user._id.toString();
        });

        // 唯一化, 防止出现两个相同的用户
        members = us.uniq(members.concat(managers));


        ep.after('applyMember', members.length, function(list) {
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: group
                }
            });
        });
        members.forEach(function(userId) {

            var auth = config.AUTH_USER;
            if (managers.indexOf(userId) > -1) {
                auth = config.AUTH_GROUP_MANAGER;
            }

            mGroup.addUserToGroup({
                userId: ObjectID(userId),
                groupId: group._id,
                auth: auth
            }, ep.group('applyMember'));
        });

    });
};

exports.get = function(req, res) {
    var parameter = req.parameter;
    var group = parameter.groupId;
    // console.log(parameter);
    mGroup.getGroupMembers(group._id, true, function(err, members) {
        group.members = members;
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: group
            }
        });
    });
};


function modifyMembers(group, members, managers, callback) {
    var needModifyManager = !!managers.length;
    var creatorId = group.creator.oid.toString();
    var groupId = group._id;
    var docs = group.__members;

    var ep = new EventProxy();
    ep.fail(callback);

    if (!docs.length) { // 没有的话所有 memebers都是新增的
        if (!members.length) { // 没有新增成员
            callback(null);
            return;
        }

        ep.after('applyMember', members.length, function(list) {
            callback(null);
        });
        members.forEach(function(userId) {

            var auth = config.AUTH_USER;
            if (managers.indexOf(userId) > -1) {
                auth = config.AUTH_GROUP_MANAGER;
            } else if (creatorId === userId) {
                // 给创建者加上管理员
                auth = config.AUTH_GROUP_MANAGER;
            }
            mGroup.addUserToGroup({
                userId: ObjectID(userId),
                groupId: groupId,
                auth: auth
            }, ep.group('applyMember'));

            Logger.debug('>>>modify group add member[all]', userId);
        });

    } else { // >>>>>>>>>>>>>>>> !!!!!!!!!!!!!!!!!!!
        // 这里要对成员做删减改

        // 这里是结束了
        ep.after('modifyMember', docs.length, function(list) {
            if (members.length) { // 如果 members 还有数据, 说明有新增用户
                ep.after('applyMember', members.length, function(list) {
                    callback(null);
                });
                members.forEach(function(userId) {

                    var auth = config.AUTH_USER;
                    if (managers.indexOf(userId) > -1) {
                        auth = config.AUTH_GROUP_MANAGER;
                    }
                    mGroup.addUserToGroup({
                        userId: ObjectID(userId),
                        groupId: groupId,
                        auth: auth
                    }, ep.group('applyMember'));

                    Logger.debug('>>>modify group add member', userId);
                });
            } else { //没有的话就处理完了
                callback(null);
            }
        });

        // 开始循环
        docs.forEach(function(doc) {
            var userId = doc.user.oid.toString();
            var oldAuth = doc.auth;
            var mIndex = members.indexOf(userId);
            if (mIndex === -1) {

                //防止创建者被删掉
                if (creatorId === userId) {
                    ep.emit('modifyMember');
                    Logger.debug('>>>modify group can not remove creator: ', userId);
                } else if (!needModifyManager && oldAuth !== 0) {
                    // 没有修改管理员时, 不能删掉管理员
                    ep.emit('modifyMember');
                    Logger.debug('>>>modify group managers empty, not remove manager', userId);
                } else {
                    // 这个用户被删了
                    mGroup.removeUserFromGroup({
                        userId: ObjectID(userId),
                        groupId: groupId
                    }, ep.group('modifyMember'));
                    Logger.debug('>>>modify group remove member', userId);
                }

            } else {
                // 这次可能被修改了权限的用户
                var auth = config.AUTH_USER;
                if (creatorId === userId) {
                    // 创建者必须是管理员
                    auth = config.AUTH_GROUP_MANAGER;
                } else if (needModifyManager) {
                    if (managers.indexOf(userId) > -1) {
                        auth = config.AUTH_GROUP_MANAGER;
                    }
                } else { // 没有修改管理员时, 权限用旧的
                    auth = oldAuth || 0;
                }

                mGroup.modifyUserAuth({
                    userId: ObjectID(userId),
                    groupId: groupId,
                    auth: auth
                }, ep.group('modifyMember'));
                // 从 members 里删除
                members.splice(mIndex, 1);
                Logger.debug('>>>modify group change member auth', userId, auth);
            }
        });
    }
}

exports.modify = function(req, res) {
    var params = req.parameter;
    var loginUser = req.loginUser;

    var group = params.groupId;
    var name = params.name;
    var content = params.content;
    var members = params.members;
    var managers = params.managers;
    var sizegroup = params.sizegroupId;
    var startTime = params.startTime;
    var endTime = params.endTime;

    var parentId = group.parent && group.parent.oid;

    var ep = new EventProxy();
    ep.fail(function(err, errCode) {
        res.json({
            err: errCode || ERR.SERVER_ERROR,
            msg: err
        });
    });

    if (name === group.name) {
        // 名字一样就没必要改
        name = null;
    }
    if (name) {
        // 小组的名字在同一个group下要唯一
        var nameQuery = {
            name: name
        };
        if (parentId) {
            nameQuery['parent.$id'] = parentId;
        } else {
            nameQuery['parent.$id'] = null;
        }
        mGroup.getGroup(nameQuery, ep.doneLater('getGroup'));

        ep.on('getGroup', function(group) {
            if (group) {
                return ep.emit('error', 'name duplicate', ERR.DUPLICATE);
            }

            ep.emit('checkNameReady');

        });
    } else {
        ep.emitLater('checkNameReady');
    }

    if (startTime && endTime) {

        checkStartEndTime({
            startTime: startTime,
            endTime: endTime,
            groupId: group._id
        }, function(err, errCode) {
            if (err) {
                return ep.emit('error', err, errCode);
            }
            ep.emit('checkTime');
        });
    } else {
        ep.emitLater('checkTime');
    }

    ep.all('checkNameReady', 'checkTime', function() {
        var doc = {};

        if (name) {
            doc.name = name;
        }
        if (content) {
            doc.content = content;
        }

        if ('status' in params) {
            doc.status = params.status;
        }

        if ('order' in params) {
            doc.order = params.order;
        }

        if (startTime) {
            doc.startTime = startTime;
        }
        if (endTime) {
            doc.endTime = endTime;
        }

        if (params.tag) {
            doc.tag = params.tag;
        }

        if (params.grade) {
            doc.grade = params.grade;
        }

        if (sizegroup) {
            doc.sizegroup = new DBRef('sizegroup', sizegroup._id);
            doc.size = sizegroup.size;
        }

        mGroup.modify({
            _id: group._id
        }, doc, ep.done('modifyGroup'));

        mGroup.getGroupMemberIds(group._id, ep.done('getMemberIds'));

    });

    ep.all('modifyGroup', 'getMemberIds', function(group, docs) {

        // 把 object 提取出 字符串的 _id
        managers = us.map(managers, function(user) {
            return user._id.toString();
        });
        members = us.map(members, function(user) {
            return user._id.toString();
        });

        // 唯一化, 防止出现两个相同的用户
        members = us.uniq(members.concat(managers));

        // 原来的成员
        group.__members = docs;

        if (members.length) {
            // 修改成员和管理员
            modifyMembers(group, members, managers, ep.done('modifyMembersSuccess'));
        } else {
            ep.emit('modifyMembersSuccess');
        }

    });

    ep.all('modifyGroup', 'modifyMembersSuccess', function(group) {

        db.dereference(group, {
            rootFolder: null
        }, function() {
            U.removePrivateMethods(group);
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: group
                }
            });
        });
    });
};

exports.list = function(req, res) {
    var params = req.parameter;

    var userId = req.loginUser._id;

    mGroup.getGroupByUser(userId, function(err, docs) {
        if (err) {
            res.json({
                err: docs || ERR.SERVER_ERROR,
                msg: err
            });
        } else {
            res.json({
                err: ERR.SUCCESS,
                result: {
                    list: docs
                }
            });
        }

    });
};