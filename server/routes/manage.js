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
var mFolder = require('../models/folder');
var mUser = require('../models/user');
var Util = require('../util');
var Logger = require('../logger');

exports.listGroups = function(req, res) {
    var params = req.parameter;
    var loginUser = req.loginUser;

    var query = {};

    if ('status' in params) {
        query.status = params.status;
    }
    if ('type' in params) {
        query.type = params.type;
    }

    if ('parent' in params) {
        if (params.parent) {
            query.parent = {
                $ne: null
            };
        } else {
            query.parent = null;
        }
    }
    if (params.keyword) {
        query['name'] = new RegExp('.*' + Util.encodeRegexp(params.keyword) + '.*');
    }

    params.extendQuery = query;

    params.isDeref = true;

    mGroup.search(params, function(err, total, result) {

        if (err) {
            return res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        }

        if (!total) {
            return res.json({
                err: ERR.SUCCESS,
                result: {
                    total: 0,
                    list: []
                }
            });
        }

        var ep = new EventProxy();
        ep.fail(function(err, errCode) {
            return res.json({
                err: errCode || ERR.SERVER_ERROR,
                msg: err
            });
        });

        ep.after('getMemberCountDone', result.length, function() {
            res.json({
                err: ERR.SUCCESS,
                result: {
                    total: total,
                    list: result
                }
            });

        });

        result.forEach(function(doc) {

            mGroup.getGroupMemberCount(doc._id, ep.group('getMemberCountDone', function(count) {
                doc.memberCount = count;
                return count;
            }));
        });

    });
};

exports.approveGroup = function(req, res) {
    var params = req.parameter;
    var group = params.groupId;

    var loginUser = req.loginUser;


    var doc = {
        status: 0,
        validateText: params.validateText || '', //审核评语
        validateStatus: Number(params.validateStatus) || 0, //0 不通过 1 通过
        validateTime: Date.now(), //审核时间
        validator: new DBRef('user', loginUser._id)
    };

    mGroup.modify({
        _id: group._id
    }, doc, function(err, doc) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        } else if (!doc) {
            res.json({
                err: ERR.NOT_FOUND,
                msg: 'no such group'
            });
        } else {
            res.json({
                err: ERR.SUCCESS
            });
        }
    });
};

exports.approveFile = function(req, res) {
    var params = req.parameter;
    var file = params.fileId;
    var school = params.school;

    var loginUser = req.loginUser;
    // 这里的文件只有个人提交到学校的
    var validateStatus = Number(params.validateStatus) || 0;
    if (validateStatus === 0) {
        // 審核不通過的刪除掉
        // 这里不用更新学校的空间大小, 文件在没有被审核之前, 是不占空间的
        mFile.delete({
            _id: file._id
        }, { /*updateUsed: true*/ }, function(err /*, doc*/ ) {
            if (err) {
                res.json({
                    err: ERR.SERVER_ERROR,
                    msg: err
                });
            } else {
                res.json({
                    err: ERR.SUCCESS
                });
            }
        });
        return;
    }

    
    //这里应该增加学校的空间使用
    mGroup.updateUsed(school._id, file.size, function() {});

    var doc = {
        status: 0,
        validateText: params.validateText || '', //审核评语
        validateStatus: validateStatus, //0 不通过 1 通过
        validateTime: Date.now(), //审核时间
        validator: new DBRef('user', loginUser._id)
    };

    mFile.modify({
        _id: file._id
    }, doc, function(err, doc) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        } else if (!doc) {
            res.json({
                err: ERR.NOT_FOUND,
                msg: 'no such group'
            });
        } else {
            res.json({
                err: ERR.SUCCESS
            });
        }
    });

};

function fetchGroupMembers(group, callback) {
    mGroup.getGroupMembers(group._id, true, function(err, list) {
        if (err) {
            callback(err);
        } else {
            group.members = list;

            mFolder.statistics(group.rootFolder.oid, {}, function(err, result) {
                if (!err) {
                    group.folderCount = result.total;
                }
                callback(null);
            });
        }
    });

}

function fetchGroupDetail(group, callback) {
    // 处理归档逻辑
    mGroup.archiveCheck(group, function(err, group) {

        db.group.find({
            'parent.$id': group._id
        }, function(err, result) {
            group.list = result;
            if (result && result.length) {
                var ep = new EventProxy();
                ep.after('fetchGroupMembers', result.length, function( /*list*/ ) {
                    callback(null, group);
                });
                ep.fail(function() {
                    callback(null, group);
                });
                result.forEach(function(doc) {
                    fetchGroupMembers(doc, ep.group('fetchGroupMembers'));
                });
            } else {
                callback(null, group);
            }
        });
    });
}

/**
 * 列出所有备课
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.listPrepares = function(req, res) {
    // var loginUser = req.loginUser;
    var parameter = req.parameter;
    var fetchChild = parameter.fetchChild || false;

    var ep = new EventProxy();
    ep.fail(function(err, errCode) {
        res.json({
            err: errCode || ERR.SERVER_ERROR,
            msg: err
        });
    });

    db.group.find({
        type: 3, // type=3 是备课学年
        parent: null
    }, ep.doneLater('findPrepare'));

    ep.on('findPrepare', function(result) {
        Logger.debug('[listPrepares] {type: 3, parent: null }.length ', result && result.length);
        if (result && result.length) {
            if (fetchChild) {
                ep.after('fetchGroupDetail', result.length, function( /*list*/ ) {
                    ep.emit('fetchGroups', result);
                });
                result.forEach(function(group) {
                    fetchGroupDetail(group, ep.done('fetchGroupDetail'));
                });

            } else {
                ep.emit('fetchGroups', result);
            }
        } else {
            ep.emit('fetchGroups', []);
        }
    });

    ep.on('fetchGroups', function(list) {
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: list.length,
                list: list
            }
        });
    });
};

/**
 * 列出学校的未审核文件
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.listFiles = function(req, res) {
    // var loginUser = req.loginUser;
    var parameter = req.parameter;

    var school = parameter.school;

    var searchParams = us.extend({}, parameter, {
        folderId: school.rootFolder.oid,
        recursive: true,
        isDeref: true
    });

    searchParams.extendQuery = {
        status: 1
    };

    mFile.search(searchParams, function(err, total, docs) {
        
        if(err){
            return res.json({
                err: total || ERR.SERVER_ERROR,
                msg: err
            });
        }

        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
};

exports.createUser = function(req, res){
    var params = req.parameter;

    var sizegroup = params.sizegroupId;
    var name = params.name;
    var nick = params.nick;

    mUser.getUser({
        name: name
    }, function(err, doc) {
        if (err) {
            return res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        }
        if (doc) {
            return res.json({
                err: ERR.DUPLICATE,
                msg: 'already has the same account name: ' + name
            });
        }
        doc = {
            name: name,
            nick: nick,
            from: 'ucenter',
            pwd: Util.md5(config.DEFAULT_USER_PWD),
            sizegroupId: sizegroup._id,
            size: sizegroup.size
        };
        mUser.create(doc, function(err, doc) {
            if (err) {
                return res.json({
                    err: doc || ERR.SERVER_ERROR,
                    msg: err
                });
            }
            delete doc.pwd; // 去除密码

            return res.json({
                err: ERR.SUCCESS,
                result: {
                    data: doc
                }
            });
        });
    });

};

exports.modifyUser = function(req, res) {

    var params = req.parameter;

    var sizegroup = params.sizegroupId;
    var user = params.userId;
    var doc = {};
    if (sizegroup) {
        doc.sizegroup = new DBRef('sizegroup', sizegroup._id);
        doc.size = sizegroup.size;
    }
    if ('status' in params) {
        doc.status = params.status;
    }
    if (params.auth) { //更改权限 
        doc.auth = params.auth;
    }
    if (params.nick) {
        doc.nick = params.nick;
    }
    mUser.update({
        _id: user._id
    }, doc, function(err, result) {
        if (err) {
            return res.json({
                err: result || ERR.SERVER_ERROR,
                msg: err
            });
        }
        res.json({
            err: ERR.SUCCESS
        });

    });

};

exports.resetUserPwd = function(req, res) {

    var user = req.parameter.userId;

    mUser.update({
        _id: user._id
    }, {
        pwd: Util.md5(config.DEFAULT_USER_PWD)
    }, function(err, doc) {
        if (err) {
            res.json({
                err: ERR.SERVER_ERROR,
                msg: err
            });
        } else {
            res.json({
                err: ERR.SUCCESS
            });
        }
    });

};

/**
 * 统计系统所有文件和小组的数量
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.statistics = function(req, res) {
    // var parameter = req.parameter;

    var ep = new EventProxy();
    ep.fail(function(err, errCode) {
        res.json({
            err: errCode || ERR.SERVER_ERROR,
            msg: err
        });
    });

    var result = {};

    // 所有用户
    db.user.count({}, function(err, num) {
        if (err) {
            Logger.error('[manage.statistics]', err);
        }
        result.totalUser = num || 0;
        ep.emit('totalUser');
    });

    db.group.count({
        type: 1
    }, function(err, num) {
        if (err) {
            Logger.error('[manage.statistics]', err);
        }
        result.totalGroup = num || 0;
        ep.emit('totalGroup');
    });

    db.group.count({
        type: 2
    }, function(err, num) {
        if (err) {
            Logger.error('[manage.statistics]', err);
        }
        result.totalDepartment = num || 0;
        ep.emit('totalDepartment');
    });

    db.folder.count({
        parent: {
            $ne: null
        }
    }, function(err, num) {
        if (err) {
            Logger.error('[manage.statistics]', err);
        }
        result.totalFolder = num || 0;
        ep.emit('totalFolder');
    });

    db.file.find({}, function(err, docs) {
        var totalSize = 0;
        var list = {};
        docs.forEach(function(file) {
            totalSize += file.size || 0;
            var obj = list[file.type];
            if (!obj) {
                list[file.type] = obj = {
                    type: file.type,
                    size: 0,
                    count: 0
                };
            }
            obj.size += file.size || 0;
            obj.count++;
        });

        result.totalFile = docs.length;
        result.totalSize = totalSize;
        result.fileStatistics = list;

        ep.emit('totalFile');
    });

    ep.all('totalUser', 'totalGroup', 'totalDepartment', 'totalFile', 'totalFolder', function() {
        res.json({
            err: ERR.SUCCESS,
            result: result
        });
    });
};