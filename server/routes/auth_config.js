// config/constants
// // 权限的常量
// var i = 0;
// exports.AUTH_USER = 0;
// exports.AUTH_GROUP_MANAGER = Math.pow(2, i++);
// exports.AUTH_DEPART_MANAGER = Math.pow(2, i++);
// exports.AUTH_MANAGER = Math.pow(2, i++);
// exports.AUTH_SYS_MANAGER = Math.pow(2, i++);

// // 用户角色的常量
// i = 0;
// exports.ROLE_NORMAL = 0;
// exports.ROLE_MANAGER = Math.pow(2, i++);
// exports.ROLE_FILE_CREATOR = Math.pow(2, i++);
// exports.ROLE_FOLDER_CREATOR = Math.pow(2, i++);
// exports.ROLE_GROUP_CREATOR = Math.pow(2, i++);
// exports.ROLE_GROUP_MEMBER = Math.pow(2, i++);
// exports.ROLE_GROUP_MANAGER = Math.pow(2, i++);
// exports.ROLE_DEPARTMENT_CREATOR = Math.pow(2, i++);
// exports.ROLE_DEPARTMENT_MEMBER = Math.pow(2, i++);
// exports.ROLE_DEPARTMENT_MANAGER = Math.pow(2, i++);
// exports.ROLE_PREPARE_MEMBER = Math.pow(2, i++);

// // 文件夹属性
// exports.FOLDER_NORMAL = 0;
// exports.FOLDER_GROUP = Math.pow(2, i++);
// exports.FOLDER_DEPARTMENT = Math.pow(2, i++);
// exports.FOLDER_DEPARTMENT_PUBLIC = Math.pow(2, i++);
// exports.FOLDER_DEPARTMENT_PRIVATE = Math.pow(2, i++);
// exports.FOLDER_PREPARE = Math.pow(2, i++);
// exports.FOLDER_SCHOOL = Math.pow(2, i++);

// // group 属性, 0是学校 1是小组 2是部门 3是备课
// exports.GROUP_SCHOOL = 0;
// exports.GROUP_GROUP = 1;
// exports.GROUP_DEPARTNMENT = 2;
// exports.GROUP_PREPARE = 3;


var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var db = require('../models/db');
var ERR = require('../errorcode.js');
var U = require('../util');
var config = require('./config');
var mUser = require('../models/user');
var mGroup = require('../models/group');
var mFolder = require('../models/folder');
var mRes = require('../models/resource');

exports.AUTH_WHITE_LIST = [
    '/api/user/login',
    '/api/user/logoff',
    '/api/user/gotoLogin',
    '/api/user/loginSuccess',
    '/api/user/loginWithQQ',
    '/api/user/loginSuccessWithQQ',
    '/api/media/upload',
    '/api/media/download'
];

exports.RULES = {
    // file 
    '/api/file': {
        verify: function(user, parameter, callback){
            // 这个接口不鉴权
            callback(null);
        }
    },
    '/api/file/upload': {
        verify: function(user, parameter, callback){
            // 可以上传文件的文件夹要求
            // 自己创建的文件; 自己所属部门/小组的文件; 部门的公开文件夹(可写)
            var folder = parameter.folderId;
            var msg = 'not auth to upload file to this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, folder){
                if(err){
                    return callback(err, folder);
                }
                if(!folder.__writable){
                    // 么有权限写该文件夹
                    return callback(msg, ERR.NOT_AUTH);
                }
                if(folder.__role & config.FOLDER_DEPARTMENT_PUBLIC){
                    // 公开文件夹还有个关闭上传的时间控制
                    if(folder.closeTime && Date.now() > folder.closeTime){
                        return callback('the folder has close upload', ERR.NOT_AUTH);
                    }
                }

                callback(null);
            });// verifyFolder
        }
    },
    '/api/file/download': {
        verify: function(user, parameter, callback){
            // 可以下载的文件要求
            // 自己创建的文件; 自己所在部门/小组的文件; 自己收件箱的文件; 别的部门的公开文件夹的文件; 学校空间的文件

            var file = parameter.fileId;

            verifyDownload(user, file, callback);
        }
    },
    '/api/file/batchDownload': {
        verify: function(user, parameter, callback){
            // 同下载
            var ep = new EventProxy();
            ep.fail(callback);

            var files = parameter.fileId;
            ep.after('verifyDone', files.length, function(list){
                callback(null);
            });

            files.forEach(function(file){
                verifyDownload(user, file, ep.group('verifyDone'));
            });

        }
    },
    '/api/file/preview': {
        verify: function(user, parameter, callback){
            // 可以预览的文件要求, 同下载
            // 自己创建的文件; 自己所在部门/小组的文件; 自己收件箱的文件; 别的部门的公开文件夹的文件; 学校空间的文件

            var file = parameter.fileId;

            verifyDownload(user, file, callback);
        }
    },
    '/api/file/save': {
        verify: function(user, parameter, callback){
            // 保存文件的限制
            // 只能保存自己收到的文件
            var msg = parameter.messageId;
            var folder = parameter.folderId;
            if(msg.toUser.oid.toString() !== user._id.toString()){
                return callback('not auth to save this file', ERR.NOT_AUTH);
            }
            callback(null);
        }
    },
    '/api/file/modify': {
        verify: function(user, parameter, callback){
            // 修改文件的限制
            // 普通人只能修改自己创建的; 管理员可以修改所有
            if(user.__role & config.ROLE_MANAGER){
                return callback(null);
            }
            var file = parameter.fileId;
            if(file.creator.oid.toString() === user._id.toString()){
                return callback(null);
            }
            callback('not auth to modify this file', ERR.NOT_AUTH);
        }
    },
    '/api/file/copy': {
        verify: function(user, parameter, callback){
            // 复制文件的限制
            // 只能从自己有权限访问的目录复制文件到自己有权限的目录; 系统管理员可以复制所有;
            if(user.__role & config.ROLE_MANAGER){
                return callback(null);
            }
            var folder = parameter.targetId;
            var msg = 'not auth copy file to this folder, folderId: ' + folder._id;
            var ep = new EventProxy();
            ep.fail(callback);
            // 检查是否有目标目录的权限
            verifyFolder(user, folder, ep.doneLater('verifyTargetFolder'));
            ep.on('verifyTargetFolder', function(folder){
                if(folder.__writable){
                    callback(null);
                }else{
                    callback(msg, ERR.NOT_AUTH);
                }

                // 检查这一批文件都是否有 权限访问
                // TODO 先不处理, 等有问题了再看
            });
        }
    },
    '/api/file/move': {
        verify: function(user, parameter, callback){
            // 复制文件的限制
            // 只能从自己有权限访问的目录复制文件到自己有权限的目录; 系统管理员可以复制所有;
            if(user.__role & config.ROLE_MANAGER){
                return callback(null);
            }
            var folder = parameter.targetId;
            var msg = 'not auth move file to this folder, folderId: ' + folder._id;
            var ep = new EventProxy();
            ep.fail(callback);
            // 检查是否有目标目录的权限
            verifyFolder(user, folder, ep.doneLater('verifyTargetFolder'));
            ep.on('verifyTargetFolder', function(){
                if(folder.__writable){
                    callback(null);
                }else{
                    callback(msg, ERR.NOT_AUTH);
                }

                // 检查这一批文件都是否有 权限访问
                // TODO 先不处理, 等有问题了再看
            });
        }
    },
    '/api/file/share': {
        verify: function(user, parameter, callback){
            // TODO 共享的权限判断比较复杂, 先只依赖前端的限制
            callback(null);
        }
    },
    '/api/file/delete': {
        // 这个接口只是设置删除标志位, 不是彻底删除
        verify: function(user, parameter, callback){
            // 只能删除自己的; 管理员可以删除所有
            var files = parameter.fileId;
            var uid = user._id.toString();
            if(user.auth & config.ROLE_MANAGER){
                return callback(null);
            }
            for(var i = 0; i < files.length; i++){
                if(files[i].creator.oid !== uid){
                    return callback('not auth to delete this file, fileId: ' + files[i]._id);
                }
            }
            return callback(null);
        }
    },
    '/api/file/search': {
        
        verify: function(user, parameter, callback){
            // 可以搜索:
            // 自己创建的文件; 自己所属部门/小组的文件; 部门的公开文件夹; 学校空间的文件; 备课小组的人可以查看备课文件夹
            
            var folder = parameter.folderId;
            var msg = 'not auth to access file to this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, fld){
                if(err){
                    if(fld === ERR.NOT_AUTH && (folder.__role & config.FOLDER_DEPARTMENT_PRIVATE)){
                        // 部门的私有目录也允许通过, 但是接口里只会返回空数组
                        return callback(null);
                    }
                    return callback(err, folder);
                }
                callback(null);
            });// verifyFolder
        }
    },
    '/api/file/query': {
        verify: function(user, parameter, callback){
            // 可以搜索:
            // 查询该用户共享给其他部门/小组的文件          
            // 不进行鉴权
            callback(null);
        }
    },

    // media
    // '/api/media/upload': {
    // },
    // '/api/media/download': {
    // },

    // folder
    '/api/folder': {
        verify: function(user, parameter, callback){
            // 这个接口不鉴权
            callback(null);
        }
    },
    '/api/folder/create': {
        
        verify: function(user, parameter, callback){
            var folder = parameter.folderId;

            var msg = 'not auth to create folder in this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, folder){
                if(err){
                    return callback(err, folder);
                }
                if(folder.__writable){
                    callback(null);
                }
                // 么有权限写该文件夹
                return callback(msg, ERR.NOT_AUTH);
            });// verifyFolder
        }
    },
    '/api/folder/modify': {
        verify: function(user, parameter, callback){
            var folder = parameter.folderId;

            var msg = 'not auth to modify this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, folder){
                if(err){
                    return callback(err, folder);
                }
                if(folder.__writable && !(folder.__user_role & config.ROLE_VISITOR)){
                    // 部门公开文件夹是可上传文件的, 但是普通游客不可修改
                    callback(null);
                }
                // 么有权限写该文件夹
                return callback(msg, ERR.NOT_AUTH);
            });// verifyFolder
        }
    },
    '/api/folder/delete': {
        verify: function(user, parameter, callback){
            var folders = parameter.folderId;

            var msg = 'not auth to delete this folder, folderId: ';

            var ep = new EventProxy();
            ep.fail(callback);

            ep.after('verifyDone', folders.length, function(list){
                callback(null);
            });

            folders.forEach(function(folder){
                verifyFolder(user, folder, ep.group('verifyDone', function(folder){
                    if(folder.__writable && (folder.__user_role & config.ROLE_FOLDER_MANAGER)){
                        // 只有文件夹的管理员才能删
                        
                    }else{
                        ep.emit('error', msg + folder._id, ERR.NOT_AUTH);
                    }
                    return folder;
                }));
            });
        }
    },
    '/api/folder/list': {
        verify: function(user, parameter, callback){
            var folder = parameter.folderId;

            var msg = 'not auth to search this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, folder){
                if(err){
                    return callback(err, folder);
                }
                callback(null);
            });// verifyFolder
        }
    },
    '/api/folder/search': {
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            },
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    // fav
    '/api/fav/create': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            }
        ]
    },
    '/api/fav/delete': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            }
        ]
    },
    '/api/fav/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    // group
    '/api/group/create': {
        method: 'POST',
        params: [
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'content',
                type: 'string'
            },
            {
                name: 'parentId',
                type: 'group'
            },
            {   name: 'members',
                type: 'users'
            },
            {
                name: 'managers',
                type: 'users'
            }
        ]
    },
    '/api/group/modify': {
        method: 'POST',
        params: [
            {
                name: 'groupId',
                type: 'group'
            },
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'content',
                type: 'string'
            },
            {
                name: 'parentId',
                type: 'group'
            },
            {   name: 'members',
                type: 'users'
            },
            {
                name: 'managers',
                type: 'users'
            }
        ]
    },
    '/api/group/': {
        method: 'GET',
        params: [
            {
                name: 'groupId',
                type: 'group'
            }
        ]
    },

    // user
    '/user/loginSuccessWithQQ': {
        method: 'GET',
        params: [
            {
                name: 'code',
                required: true
            },
            {
                name: 'state',
                required: true
            }
        ]
    },

    // recycle
    '/api/recycle/delete': {
        verify: function(user, parameter, callback){
            var files = parameter.fileId;
            var uid = user._id.toString();
            var msg = 'not auth to delete this file, fileId: ';
            for(var i = 0, file; i < files.length; i++){
                file = files[i];
                if(file.creator.oid.toString() !== uid){
                    return callback(msg + file._id, ERR.NOT_AUTH);
                }
            }
            callback(null);
        }
    },
    '/api/recycle/revert': {
        verify: function(user, parameter, callback){
            var files = parameter.fileId;
            var uid = user._id.toString();
            var msg = 'not auth to revert this file, fileId: ';
            for(var i = 0, file; i < files.length; i++){
                file = files[i];
                if(file.creator.oid.toString() !== uid){
                    return callback(msg + file._id, ERR.NOT_AUTH);
                }
            }
            callback(null);
        }
    },
    '/api/recycle/search': {
        verify: function(user, parameter, callback){
            // 该接口不鉴权
            callback(null);
        }

    },

    // board
    '/api/board/create': {
        method: 'POST',
        params: [
            {
                name: 'content',
                required: true
            },
            {
                name: 'groupId',
                type: 'group',
                required: true
            },
            {
                name: 'parentId',
                type: 'board'
            }
        ]
    },
    '/api/board/approve': {
        method: 'POST',
        params: [
            {
                name: 'boardId',
                type: 'board',
                required: true
            },
            {
                name: 'validateText',
                type: 'string'
            },
            {
                name: 'validateStatus',
                type: 'number',
                required: true
            }
        ]
    },
    '/api/board/delete': {
        method: 'POST',
        params: [
            {
                name: 'boardId',
                type: 'board',
                required: true
            }
        ]
    },
    '/api/board/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'groupId',
                type: 'group',
                required: true
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    // message 
    '/api/message/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'cate',
                type: 'number',
                required: true
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },


    // manage
    '/api/manage/listGroups': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },
    '/api/manage/approveGroup': {
        method: 'POST',
        params: [
            {
                name: 'groupId',
                type: 'group',
                required: true
            },
            {
                name: 'validateText',
                type: 'string'
            },
            {
                name: 'validateStatus',
                type: 'number',
                required: true
            }
        ]
    },
    '/api/manage/approveFile': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            },
            {
                name: 'validateText',
                type: 'string'
            },
            {
                name: 'validateStatus',
                type: 'number',
                required: true
            }
        ]
    },
    '/api/manage/listPrepares': {
        method: 'GET'
    }
};

/**
 * 验证是否有权限进行下载
 * @param  {[type]}   user     [description]
 * @param  {[type]}   file     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function verifyDownload(user, file, callback){
    // 下载的权限控制
    // 自己创建的文件; 自己所在部门/小组的文件; 自己收件箱的文件; 别的部门的公开文件夹的文件; 学校空间的文件
    var ep = new EventProxy();
    ep.fail(callback);

    if(user._id.toString() === file.creator.oid.toString()){
        user.__role |= config.ROLE_FILE_CREATOR;
        // 自己创建的文件
        return callback(null);
    }
    // 检查是否是自己收件箱的文件
    mMessage.getMessage({
        'resource.$id': file.resource.oid,
        'toUser.$id': user._id
    }, ep.doneLater('getMessage'));

    ep.on('getMessage', function(msg){
        if(msg){
            // 自己收件箱的文件
            return callback(null);
        }
        mFolder.getFolder({ _id: file.folder.oid }, ep.done('getFolder'));
        mRes.getResource({ _id: file.resource.oid }, ep.done('getRes'));
    });

    ep.all('getFolder', 'getRes', function(folder, resource){
        if(!folder){
            return callback('no folder contain this file, fileId: ' + file._id, ERR.NOT_FOUND);
        }
        if(!resource){
            return callback('can not find the resource, fileId: ' + file._id, ERR.NOT_FOUND);
        }
        file.__folder = folder;
        file.__resource = resource;

        verifyFolder(user, folder, ep.done('verifyFolder'));

    });

    ep.on('verifyFolder', function(folder){

        if(folder.__role & config.FOLDER_SCHOOL){
            if(file.validateStatus === 1){
                // 学校空间通过审核的才能下载
                return callback(null);
            }else{
                return callback('this file has not validate, fileId: ' + file._id, ERR.NOT_AUTH);
            }
        }
        return callback(null);
    });
}

/**
 * 验证是否有文件夹的访问权限
 * @param  {[type]}   user     [description]
 * @param  {[type]}   folder   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function verifyFolder(user, folder, callback){
    // 可访问的文件夹权限控制
    // 管理员; 自己创建的文件夹; 自己所属部门/小组的文件; 部门的公开文件夹; 学校空间的文件
    var msg = 'not auth to access this folder, folderId: ' + folder._id;
    var hasAuth = false;

    folder.__role = config.FOLDER_NORMAL;
    folder.__writable = false;

    if(user.__role & config.ROLE_MANAGER){

        // 这人是管理员大大
        folder.__writable = true;
        hasAuth = true;
        // return callback(null, folder);
    }
    if(user._id.toString() === folder.creator.oid.toString()){

        // 这里设置为只要是自己创建的文件夹, 不管是不是小组的, 创建者都有权修改
        user.__role |= config.ROLE_FOLDER_CREATOR;
        folder.__writable = true;
        hasAuth = true;
    }
    if(!folder.group){

        folder.__user_role = user.__role;
        if(hasAuth){

            // 个人的私人文件夹
            folder.__role |= config.FOLDER_PRIVATE;
            // 个人空间是完全私密的，除超级管理员之外，其它用户不可访问
            return callback(null, folder);
        }
        // 这个文件夹不是小组的, 又不是创建者, 就没有权限访问
        return callback(msg, ERR.NOT_AUTH);
    }

    mGroup.getGroup({ _id: folder.group.oid }, function(err, group){
        if(err){
            return callback(err);
        }
        folder.__group = group;
        
        if(group.type === config.GROUP_SCHOOL){
            
            folder.__role |= config.FOLDER_SCHOOL;
            // 学校空间的文件夹, 允许访问
            hasAuth = true;
            user.__role |= config.ROLE_VISITOR;
            // return callback(null, folder);
        }else if(group.type === config.GROUP_DEPARTNMENT){

            folder.__role |= config.FOLDER_DEPARTMENT;

            if(folder.isOpen){
                // 部门的公开文件夹
                hasAuth = true;
                // 注意: 这里可能会误判, 在 isGroupMemberHandler 里需要回滚
                user.__role |= config.ROLE_VISITOR;
                folder.__role |= config.FOLDER_DEPARTMENT_PUBLIC;
                if(!folder.isReadonly){
                    
                    folder.__writable = true;
                }
            }else{
                // 部门私有目录
                folder.__role |= config.FOLDER_DEPARTMENT_PRIVATE;
            }

        }else if(group.type === config.GROUP_GROUP) {
            
            folder.__role |= config.FOLDER_GROUP;
        }else if(group.type === config.GROUP_PREPARE){
            
            folder.__role |= config.FOLDER_PREPARE;

            if(user.__role & config.ROLE_PREPARE_MEMBER) {
                // 备课小组(pt === 1 的 group)的成员, 可以访问备课(type === 3)的文件
                hasAuth = true;
                user.__role |= config.ROLE_VISITOR;
            }
        }

        // 看是否是部门/小组成员
        mGroup.isGroupMember(group._id, user._id, isGroupMemberHandler);
    });

    // 这里不用 EventProxy, 尽量提高性能
    function isGroupMemberHandler(err, bool, result){

        var group = folder.__group;
        if(err){

            return callback(err);
        }else if(bool){
            // 自己所属部门/小组的文件, 可能是管理员
            folder.__writable = true;
            hasAuth = true;
            // FIXME depart manager 之前没有启用过, 所以这里也不进行判断了
            // 如果要改, 需要改动到 routes/group#modify
            if(result.auth & config.AUTH_GROUP_MANAGER){

                user.__role |= config.ROLE_GROUP_MANAGER;
            }
            if(result.auth & config.AUTH_DEPART_MANAGER){

                user.__role |= config.ROLE_DEPARTMENT_MANAGER;
            }
            // 上面的公开文件夹判断可能会把成员也判断成 visitor, 这里要回滚一下
            user.__role &= ~config.ROLE_VISITOR;
            // 小组管理员可以读写小组空间所有数据
            // 部门管理员可以读写部门空间所有数据

        }
        folder.__user_role = user.__role;
        if(hasAuth){
            return callback(null, folder);
        }
        return callback(msg, ERR.NOT_AUTH);
    }
}
