

var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var db = require('../models/db');
var ERR = require('../errorcode.js');
var U = require('../util');
var config = require('../config');
var Logger = require('../logger');
var mUser = require('../models/user');
var mGroup = require('../models/group');
var mFolder = require('../models/folder');
var mRes = require('../models/resource');
var mMessage = require('../models/message');

exports.AUTH_WHITE_LIST = [
    '/api/user/login',
    '/api/user/logoff',
    '/api/user/gotoLogin',
    '/api/user/loginSuccess',
    '/api/user/loginWithQQ',
    '/api/user/loginSuccessWithQQ',
    // '/api/media/upload',
    // '/api/media/download',
    '/api/system/init' // 系统初始化接口, 只会运行一次
];

exports.RULES = {
    // file 
    // '/api/file': {
    //     verify: function(user, parameter, callback){
    //         // 这个接口不鉴权
    //         callback(null);
    //     }
    // },
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
                if(folder.__archived){
                    return callback('can\'t upload file to an archived folder', ERR.UNMODIFABLE);
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
            ep.after('verifyDone', files.length, function(){
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
            var message = parameter.messageId;

            if(file){ // 普通文件预览

                verifyDownload(user, file, callback);
            }else if(message){ // 对收件箱/发件箱的文件预览

                var uid = user._id.toString();
                if(message.toUser.oid.toString() !== uid && message.fromUser.oid.toString() !== uid){
                    return callback('not auth to preview this file', ERR.NOT_AUTH);
                }
                mRes.getResource({ _id: message.resource.oid }, function(err, resource){
                    if(err){
                        return callback(err);
                    }
                    if(!resource){
                        return callback('the resource has been deleted', ERR.NOT_FOUND);
                    }
                    message.__resource = resource;
                    callback(null);
                    
                });
            }else {

                return callback('need fileId or messageId', ERR.PARAM_ERROR);
            }
        }
    },
    '/api/file/save': {
        verify: function(user, parameter, callback){
            // 保存文件的限制
            // 只能保存自己收到的文件, 同时目标文件夹必须是自己的私人文件夹
            // 默认保存到自己的个人根目录
            var message = parameter.messageId;
            var folder = parameter.folderId;

            if(message.toUser.oid.toString() !== user._id.toString()){
                return callback('not auth to save this file', ERR.NOT_AUTH);
            }
            if(folder){
                
                // 这里可以不用检验是否归档了, 现在这里传的是自己目录下的文件
                verifyFolder(user, folder, function(err, folder){
                    if(err){
                        return callback(err, folder);
                    }
                    if(!folder.__writable){
                        return callback('not auth to save file to this folder, folderId: ' + folder._id, ERR.NOT_AUTH);
                    }
                    callback(null);
                });
            }else{
                callback(null);
            }
        }
    },
    '/api/file/modify': {
        verify: function(user, parameter, callback){
            // 修改文件的限制
            // 普通人只能修改自己创建的; 管理员可以修改所有
            // if(user.__role & config.ROLE_MANAGER){
            //     return callback(null);
            // }
            var file = parameter.fileId;
            mFolder.getFolder({ _id: file.folder.oid }, function(err, folder){
                if(err){
                    return callback(err, folder);
                }
                if (!folder) {
                    return callback('can\'t find a folder contain this file');
                }
                file.__folder = folder;
                
                verifyFolder(user, folder, function(err, folder){
                    if(folder.__archived){
                        return callback('can\'t modify an archived file', ERR.UNMODIFABLE);
                    }
                    if(!folder.__editable){
                        return callback('not auth to modify this file', ERR.NOT_AUTH);
                    }
                    return callback(null);
                });

            });
            // if(file.creator.oid.toString() === user._id.toString()){
            //     return callback(null);
            // }
            // callback('not auth to modify this file', ERR.NOT_AUTH);
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
                if(folder.__archived){
                    return callback('can\'t copy file to an archived folder', ERR.UNMODIFABLE);
                }
                if(folder.__writable){
                    callback(null);
                }else{
                    callback(msg, ERR.NOT_AUTH);
                }

                // 检查这一批文件都是否有 权限访问
                // FIXME 先不处理, 等有问题了再看
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
                if(folder.__archived){
                    return callback('can\'t move file to an archived folder', ERR.UNMODIFABLE);
                }
                if(folder.__writable){
                    callback(null);
                }else{
                    callback(msg, ERR.NOT_AUTH);
                }

                // 检查这一批文件都是否有 权限访问
                // FIXME 先不处理, 等有问题了再看
            });
        }
    },
    '/api/file/share': {
        verify: function(user, parameter, callback){
            // FIXME 共享的权限判断比较复杂, 先只依赖前端的限制
            callback(null);
        }
    },
    '/api/file/delete': {
        // 这个接口只是设置删除标志位, 不是彻底删除
        verify: function(user, parameter, callback){

            // 只能删除自己的; 管理员可以删除所有; 部门和小组管理员可以删除所有
            
            var ep = new EventProxy();
            ep.fail(callback);

            var files = parameter.fileId;
            ep.after('verifyDone', files.length, function(){
                callback(null);
            });

            files.forEach(function(file){
                verifyDelete(user, file, ep.group('verifyDone'));
            });

        }
    },
    '/api/file/search': {
        
        verify: function(user, parameter, callback){
            // 可以搜索:
            // 自己创建的文件; 自己所属部门/小组的文件; 部门的公开文件夹; 学校空间的文件; 备课小组的人可以查看备课文件夹
            
            var folder = parameter.folderId;
            // var msg = 'not auth to access file to this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, errCode){
                if((errCode === ERR.NOT_AUTH) &&
                        (folder.__role & config.FOLDER_DEPARTMENT_PRIVATE)){
                    
                    // 部门的私有目录也允许通过, 但是接口里只会返回空数组
                    return callback(null);
                }
                if(err){
                    return callback(err, errCode);
                }
                callback(null);
            });// verifyFolder
        }
    },
    // '/api/file/query': {
    //     verify: function(user, parameter, callback){
    //         // 可以搜索:
    //         // 查询该用户共享给其他部门/小组的文件          
    //         // 不进行鉴权
    //         callback(null);
    //     }
    // },
    '/api/file/statistics': {
        verify: function(user, parameter, callback){
            // 可以统计:
            // 自己创建的文件; 自己所属部门/小组的文件; 部门的公开文件夹; 学校空间的文件; 备课小组的人可以查看备课文件夹
            
            var folder = parameter.folderId;
            // var msg = 'not auth to access file to this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, errCode){

                if(err){
                    return callback(err, errCode);
                }
                callback(null);
            });// verifyFolder
        }
    },
    // media
    // '/api/media/upload': {
    // },
    // '/api/media/download': {
    // },

    // folder
    // '/api/folder': {
    //     verify: function(user, parameter, callback){
    //         // 这个接口不鉴权
    //         callback(null);
    //     }
    // },
    '/api/folder/create': {
        
        verify: function(user, parameter, callback){
            var folder = parameter.folderId;

            var msg = 'not auth to create folder in this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, folder){
                if(err){
                    return callback(err, folder);
                }
                if(folder.__archived){
                    return callback('can\'t create folder in an archived folder', ERR.UNMODIFABLE);
                }
                if(folder.__writable){
                    return callback(null);
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
                if(folder.__archived){
                    return callback('can\'t modify an archived folder', ERR.UNMODIFABLE);
                }
                if(folder.__editable){
                    // 部门公开文件夹是可上传文件的, 但是普通游客不可修改
                    return callback(null);
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
            var msg2 = 'can\'t delete an archived folder, folderId: ';

            var ep = new EventProxy();
            ep.fail(callback);

            ep.after('verifyDone', folders.length, function(){
                callback(null);
            });

            folders.forEach(function(folder){
                verifyFolder(user, folder, ep.group('verifyDone', function(folder){
                    if(folder.__archived){
                        ep.emit('error', msg2 + folder._id, ERR.UNMODIFABLE);
                    }else if(folder.__writable && (folder.__user_role & config.ROLE_FOLDER_MANAGER)){
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

            verifyFolder(user, folder, function(err, errCode){
                Logger.debug('folder/list#verify:', err, 'FOLDER_DEPARTMENT_ROOT: ', folder.__role & config.FOLDER_DEPARTMENT_ROOT);
                if((errCode === ERR.NOT_AUTH) &&
                        (folder.__role & config.FOLDER_DEPARTMENT_ROOT)){

                    // 如果这个目录是部门的根目录, 那么也可以列出文件夹, 但是不能搜索文件
                    return callback(null);
                }
                if(err){
                    return callback(msg, errCode);
                }
                callback(null);
            });// verifyFolder
        }
    },
    '/api/folder/search': {
        verify: function(user, parameter, callback){
            var folder = parameter.folderId;

            var msg = 'not auth to search this folder, folderId: ' + folder._id;

            verifyFolder(user, folder, function(err, errCode){
                if((errCode === ERR.NOT_AUTH) &&
                        (folder.__role & config.FOLDER_DEPARTMENT_ROOT)){

                    // 如果这个目录是部门的根目录, 那么也可以列出文件夹, 但是不能搜索文件
                    return callback(null);
                }
                if(err){
                    return callback(msg, errCode);
                }
                callback(null);
            });// verifyFolder
        }
    },

    // fav
    // '/api/fav/create': {

    //     verify: function(user, parameter, callback){
    //         // 该接口不鉴权
    //         callback(null);
    //     }
    // },
    // '/api/fav/delete': {
    //     verify: function(user, parameter, callback){
    //         // 该接口不鉴权
    //         callback(null);
    //     }
    // },
    // '/api/fav/search': {
    //     verify: function(user, parameter, callback){
    //         // 该接口不鉴权
    //         callback(null);
    //     }
    // },

    // group
    // '/api/group': {
    //     verify: function(user, parameter, callback){
    //         // 该接口不鉴权
    //         callback(null);
    //     }
    // },

    // '/api/group/create': {
        
    //     verify: function(user, parameter, callback){
    //         // 该接口不鉴权
    //         // 任何人都能申请创建小组
    //         callback(null);
    //     }
    // },
    '/api/group/modify': {

        verify: function(user, parameter, callback){
            // 可以修改小组的权限
            // 系统管理员; 小组管理员; 部门管理员
            var group = parameter.groupId;
            var msg = 'not auth to modify this group, groupId: ' + group._id;

            verifyGroup(user, group, function(err){
                if (err || !group.__editable) {
                    return callback(msg, ERR.NOT_AUTH);
                }

                return callback(null);
            });
        }
    },
    // '/api/group/list': {
    // },
    

    // user


    // recycle
    '/api/recycle/delete': {
        verify: function(user, parameter, callback){
            var files = parameter.fileId;
            var group = parameter.groupId;
            var uid = user._id.toString();
            var msg = 'not auth to delete this file, fileId: ';

            if(group){
                verifyGroup(user, group, function(err){
                    if(err){
                        return callback(msg, ERR.NOT_AUTH);
                    }else if(group.__editable){
                        return callback(null);
                    }else if(group.__writable){
                        // 普通写权限的成员, 只能对自己创建的文件操作
                        for(var i = 0; i < files.length; i++){
                            if(files[i].creator.oid.toString() !== uid){
                                return callback(msg + files[i]._id);
                            }
                        }
                    }

                    // 这里就不再检查这些文件是否是属于这个group的了
                    return callback(null);
                });
            }else{
                for(var i = 0; i < files.length; i++){
                    if(files[i].creator.oid.toString() !== uid){
                        return callback(msg + files[i]._id);
                    }
                }
                return callback(null);
            }
        }
    },
    '/api/recycle/revert': {
        verify: function(user, parameter, callback){
            var files = parameter.fileId;
            var group = parameter.groupId;
            var uid = user._id.toString();
            var msg = 'not auth to revert this file, fileId: ';
            
            if(group){
                verifyGroup(user, group, function(err){
                    if(err){
                        return callback(msg, ERR.NOT_AUTH);
                    }else if(group.__editable){
                        return callback(null);
                    }else if(group.__writable){
                        // 普通写权限的成员, 只能对自己创建的文件操作
                        for(var i = 0; i < files.length; i++){
                            if(files[i].creator.oid.toString() !== uid){
                                return callback(msg + files[i]._id);
                            }
                        }
                    }

                    // 这里就不再检查这些文件是否是属于这个group的了
                    return callback(null);
                });
            }else{
                for(var i = 0; i < files.length; i++){
                    if(files[i].creator.oid.toString() !== uid){
                        return callback(msg + files[i]._id);
                    }
                }
                return callback(null);
            }
        }
    },
    '/api/recycle/search': {
        verify: function(user, parameter, callback){

            var group = parameter.groupId;
            var msg = 'not auth to search this recycle bin , groupId: ' + group;
            
            if(group){ // 搜索小组的回收站需要检查权限
                verifyGroup(user, group, function(err){
                    if(err){
                        return callback(msg, ERR.NOT_AUTH);
                    }
                    return callback(null);
                });
            }else{
                return callback(null);
            }
        }
    },

    // board
    '/api/board/create': {

    },
    '/api/board/approve': {

        verify: function(user, parameter, callback){
            // 可以审核留言板的权限:
            // 管理员; 小组/部门管理员
            var board = parameter.boardId;
            var msg = 'not auth to approve this board, boardId: ' + board._id;
            
            mGroup.getGroup({ _id: board.group.oid }, function(err, group){

                if (err) {
                    return callback(err);
                }

                verifyGroup(user, group, function(err){
                    if (err || !group.__editable) {
                        return callback(msg, ERR.NOT_AUTH);
                    }

                    return callback(null);
                });
            });

        }
    },
    '/api/board/delete': {
        verify: function(user, parameter, callback){
            // 可以删除留言板的权限:
            // 管理员; 小组/部门管理员
            var board = parameter.boardId;
            var msg = 'not auth to delete this board, boardId: ' + board._id;
            
            mGroup.getGroup({ _id: board.group.oid }, function(err, group){

                if (err) {
                    return callback(err);
                }

                verifyGroup(user, group, function(err){
                    if (err || !group.__editable) {
                        return callback(msg, ERR.NOT_AUTH);
                    }

                    return callback(null);
                });
            });

        }
    },
    '/api/board/search': {
        verify: function(user, parameter, callback){

            var group = parameter.groupId;
                
            verifyGroup(user, group, function(err){

                // 这里是为了获取 group 的 editable 属性
                return callback(null);
            });
        }
    },

    // message 
    // '/api/message/search': {
        
    // },


    // manage
    '/api/manage/*': { // 所有 manage 下面的接口都需要管理员才可以操作

        verify: function(user, parameter, callback){

            if(user.__role & config.ROLE_MANAGER){

                return callback(null);
            }
            return callback('no auth');
        }
    },
    
    '/api/manage/listPrepares': {
        verify: function(user, parameter, callback){

            if((user.__role & config.ROLE_MANAGER) ||
                    (user.__role & config.ROLE_PREPARE_MEMBER)){
                return callback(null);
            }
            return callback('no auth');
        }
    },

    '/api/manage/approveFile': {
        verify: function(user, parameter, callback){

            mGroup.getGroup({
                type: 0
            }, function(err, group){
                if (err) {
                    return callback(err);
                }
                if (!group) {
                    return callback('system error, school has not init!');
                }
                parameter.school = group;
                verifyGroup(user, group, function(err){
                    if (group.__editable) {
                        return callback(null);
                    } else {
                        return callback('no auth', ERR.NOT_AUTH);
                    }
                });
            });

        }
    },

    '/api/manage/listFiles': {

        verify: function(user, parameter, callback){

            mGroup.getGroup({
                type: 0
            }, function(err, group){
                if (err) {
                    return callback(err);
                }
                if (!group) {
                    return callback('system error, school has not init!');
                }
                parameter.school = group;
                verifyGroup(user, group, function(err){
                    if (group.__editable) {
                        return callback(null);
                    } else {
                        return callback('no auth', ERR.NOT_AUTH);
                    }
                });
            });
        }
    },

    // '/api/storage': {
    //     verify: function(user, parameter, callback){

    //         if(user.__role & config.ROLE_MANAGER){
    //             return callback(null);
    //         }
    //         return callback('no auth');
    //     }
    // },
    '/api/storage/set': {
        verify: function(user, parameter, callback){

            if(user.__role & config.ROLE_MANAGER){
                return callback(null);
            }
            return callback('no auth');
        }
    },

    // system
    '/api/system/*': { // 系统初始化相关的接口, 只有系统管理员有权限

        verify: function(user, parameter, callback){

            if(user.__role & config.AUTH_SYS_MANAGER){

                return callback(null);
            }
            return callback('no auth');
        }
    },

    // organization
    '/api/organization/*': { // 用户中心的组织架构的接口, 管理员可调用

        verify: function(user, parameter, callback){

            if(user.__role & config.AUTH_MANAGER){

                return callback(null);
            }
            return callback('no auth');
        }
    },
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
    var msg = 'not auth to view this file, fileId: ' + file._id;
    var hasAuth = false;

    var ep = new EventProxy();
    ep.fail(callback);

    if(user._id.toString() === file.creator.oid.toString()){
        user.__role |= config.ROLE_FILE_CREATOR;
        // 自己创建的文件
        hasAuth = true;
        // return callback(null);
    }
    
    mFolder.getFolder({ _id: file.folder.oid }, ep.done('getFolder'));

    mRes.getResource({ _id: file.resource.oid }, ep.done('getRes'));

    // 检查是否是自己收件箱的文件
    mMessage.getMessage({ 'resource.$id': file.resource.oid, 'toUser.$id': user._id}, ep.doneLater('getMessage'));

    ep.all('getFolder', 'getRes', 'getMessage', function(folder, resource, message){
        if(!folder){
            return callback('no folder contain this file, fileId: ' + file._id, ERR.NOT_FOUND);
        }
        if(!resource){
            return callback('can\'t find the resource, fileId: ' + file._id, ERR.NOT_FOUND);
        }
        if(message){
            // 自己收件箱的文件
            hasAuth = true;
        }

        file.__folder = folder;
        file.__resource = resource;

        verifyFolder(user, folder, ep.done('verifyFolder'));

    });

    ep.on('verifyFolder', function(folder){

        if(folder.__role & config.FOLDER_SCHOOL){
            if(file.validateStatus === 1){
                // 学校空间通过审核的才能下载
                hasAuth = true;
                // return callback(null);
            }else{
                return callback('this file has not validate, fileId: ' + file._id, ERR.NOT_AUTH);
            }
        }else{
            hasAuth = true;
        }
        file.__user_role = user.__role;

        if(hasAuth){
            return callback(null);
        }
        return callback(msg, ERR.NOT_AUTH);
    });
}

/**
 * 校验文件是否可以删除
 * @param  {[type]}   user     [description]
 * @param  {[type]}   file     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function verifyDelete(user, file, callback){

    // 普通用户只能删除自己的; 管理员可以删除所有; 部门和小组管理员可以删除所有

    var msg = 'not auth to delete this file, fileId: ' + file._id;
    var hasAuth = true;

    var ep = new EventProxy();
    ep.fail(callback);

    if(user._id.toString() === file.creator.oid.toString()){

        // 自己创建的文件
        user.__role |= config.ROLE_FILE_CREATOR;
        hasAuth = true;

    }

    mFolder.getFolder({ _id: file.folder.oid }, ep.doneLater('getFolder'));

    ep.on('getFolder', function(folder){

        if(!folder){
            return callback('no folder contain this file, fileId: ' + file._id, ERR.NOT_FOUND);
        }

        file.__folder = folder;

        verifyFolder(user, folder, ep.done('verifyFolder'));

    });

    ep.on('verifyFolder', function(folder){

        if(folder.__archived){
            return callback('can\'t delete an archived file', ERR.UNMODIFABLE);
        }

        if(folder.__editable && (user.__role & config.ROLE_FOLDER_MANAGER)){

            // 管理员和小组/部门管理员和文件夹创建者
            hasAuth = true;
        }
        
        file.__user_role = user.__role;

        if(hasAuth){
            return callback(null);
        }
        return callback(msg, ERR.NOT_AUTH);

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
    folder.__editable = false;

    if(user.__role & config.ROLE_MANAGER){

        // 这人是管理员大大
        folder.__writable = true;
        folder.__editable = true;
        hasAuth = true;
        // return callback(null, folder);
    }
    if(user._id.toString() === folder.creator.oid.toString()){

        // 这里设置为只要是自己创建的文件夹, 不管是不是小组的, 创建者都有权修改
        user.__role |= config.ROLE_FOLDER_CREATOR;
        folder.__writable = true;
        folder.__editable = true;
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

    // 获取文件夹所在的小组
    mGroup.getGroup({ _id: folder.group.oid }, function(err, group){
        if(err){
            return callback(err);
        }
        folder.__group = group;
        
        if(group.type === config.GROUP_SCHOOL){
            
            user.__role |= config.ROLE_VISITOR;
            folder.__role |= config.FOLDER_SCHOOL;
            // 学校空间的文件夹, 允许访问
            hasAuth = true;
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

                if(folder._id.toString() === group.rootFolder.oid.toString()){

                    // 部门的根目录, 在 folder/list 和 folder/search 等需要用到
                    user.__role |= config.ROLE_VISITOR;
                    folder.__role |= config.FOLDER_DEPARTMENT_ROOT;
                }
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
        verifyGroup(user, group, verifyGroupHandler);
    });
    
    // 这里不用 EventProxy, 尽量提高性能
    function verifyGroupHandler(err, group){

        if (!err) {
            // 自己所属部门/小组的文件, 可能是管理员
            folder.__writable = true;
            folder.__editable = true;
            hasAuth = true;
            
            // 上面的公开文件夹判断可能会把成员也判断成 visitor, 这里要回滚一下
            user.__role &= ~config.ROLE_VISITOR;
            // 小组管理员可以读写小组空间所有数据
            // 部门管理员可以读写部门空间所有数据
        }

        folder.__user_role = user.__role;
        group.__user_role = user.__role;

        if (group.__archived){
            // 已经归档的小组, 不能上传/修改/删除, 只能查看
            folder.__writable = false;
            folder.__editable = false;
            folder.__archived = true;
        }

        if(hasAuth){
            return callback(null, folder);
        }
        return callback(msg, ERR.NOT_AUTH);

    }

}

/**
 * [verifyGroup description]
 * @param  {[type]}   user     [description]
 * @param  {[type]}   group    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function verifyGroup(user, group, callback){

    var msg = 'not auth to access this group, groupId: ' + group._id;
    var hasAuth = false;

    if (group.status === 2){
        // 已经归档的小组, 不能上传/修改/删除, 只能查看
        group.__archived = true;
    }

    if (user.__role & config.ROLE_MANAGER) {

        group.__editable = true;
        hasAuth = true;
    }

    mGroup.isGroupMember(group._id, user._id, function(err, bool, result){

        if (err) {

            return callback(err);
        } else if (bool) {
            // FIXME depart manager 之前没有启用过, 所以这里也不进行判断了
            // 如果要改, 需要改动到 routes/group#modify

            if(group.type === config.GROUP_DEPARTNMENT){

                user.__role |= config.ROLE_DEPARTMENT_MEMBER;
            }else if(group.type === config.GROUP_GROUP) {
                
                user.__role |= config.ROLE_GROUP_MEMBER;
            }
            
            if (result.auth & config.AUTH_GROUP_MANAGER) {

                user.__role |= config.ROLE_GROUP_MANAGER;
                group.__editable = true;
            }
            if (result.auth & config.AUTH_DEPART_MANAGER) {

                user.__role |= config.ROLE_DEPARTMENT_MANAGER;
                group.__editable = true;
            }

            hasAuth = true;
        }

        group.__user_role = user.__role;
        if (hasAuth) {
            return callback(null, group);
        }
        return callback(msg, ERR.NOT_AUTH);
    });
}