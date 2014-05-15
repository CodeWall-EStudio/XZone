var http = require('http');
var fs = require('fs');
var path = require('path');
var EventProxy = require('eventproxy');
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');

var config = require('../config');
var ERR = require('../errorcode');
var db = require('../models/db');
var mGroup = require('../models/group');
var Util = require('../util');
var userHelper = require('../helper/user_helper');
var fileHelper = require('../helper/file_helper');
var mUser = require('../models/user');
var mFolder = require('../models/folder');
var mSizegroup = require('../models/sizegroup');

var FileTool = require('../file_tool');

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
        name : '备课检查',
        status : 0,
        type : 2,
        pt : 1,
        creator: req.loginUser._id
    };
    // 防止重复创建
    db.group.findOne(param, function(err, doc){
        if(!doc){
            mGroup.create(param,function(){
                console.log('备课检查创建完成');
            });
        }else{
            console.log('备课检查已经创建');
        }
    });
    

   var param2 = {
        name : '学校空间',
        status : 0,
        type : 0,
        creator: req.loginUser._id
    };
    // 防止重复创建
    db.group.findOne(param2, function(err, doc){
        if(!doc){
            mGroup.create(param2,function(){
                console.log('学校空间创建完成');
            });
        }else{
            console.log('学校空间已经创建了!!');
        }
    });

    res.json({
        err: 0,
        result: {
            'msg' : '初始化完成!'
        }
    });

};

// 初始化学校的部门架构
exports.initDeparts = function(req, res){
    var skey = req.skey;
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
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

};

// 合并旧的用户数据
exports.mergeOldData = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
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

                    de.user.remove({ _id: user._id }, function(){
                        console.log('remove duplicate user', user.name);
                    });

                    var newUser = us.extend({}, user, oldUser);

                    db.user.save(newUser, ep.group('mergeDone'));

                }else{
                    ep.emit('mergeDone');
                }
            });
        });

    });
};

exports.fixUserRootFolder = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }
    var result = [];
    db.user.find({}, function(err, docs){
        if(docs && docs.length){

            docs.forEach(function(user){
                if(user.rootFolder && typeof user.rootFolder.oid === 'string'){
                    user.rootFolder = new DBRef('folder', new ObjectID(user.rootFolder.oid));
                    db.user.save(user, function(){
                        
                    });
                    result.push(user.nick);
                }
            });
        }
        res.json({ err: ERR.SUCCESS, total: result.length, result: result });
    });
};

exports.fixSaveFileFolder = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }
    var result = [];
    db.file.find({}, function(err, docs){
        if(docs && docs.length){

            docs.forEach(function(file){
                if(typeof file.folder.oid === 'string'){
                    file.folder = new DBRef('folder', new ObjectID(file.folder.oid));
                    db.file.save(file, function(){
                        
                    });
                    result.push([file._id, file.name]);
                }
            });
        }
        res.json({ err: ERR.SUCCESS, total: result.length, result: result });
    });
};

exports.fixRootFolderTypeError = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }
    var result = [];
    db.folder.find({}, function(err, docs){
        if(docs && docs.length){

            docs.forEach(function(folder){
                var isModify = false;
                if(folder.parent && typeof folder.parent.oid === 'string'){
                    isModify = true;
                    folder.parent = new DBRef('folder', new ObjectID(folder.parent.oid));
                }
                if(folder.top && typeof folder.top.oid === 'string'){
                    isModify = true;
                    folder.top = new DBRef('folder', new ObjectID(folder.top.oid));
                }
                if(isModify){
                    db.folder.save(folder, function(){
                        
                    });
                    result.push([folder._id, folder.name]);
                }
            });
        }
        res.json({ err: ERR.SUCCESS, total: result.length, result: result });
    });
};

function fixMediaFolderParent(doc, result, callback){
    if(doc.parent){
        return callback(null);
    }
    // 先找到新媒体的目录
    db.folder.findOne({ 'creator.$id': doc.creator.oid, 'name': '新媒体资源' }, function(err, media){
        if(!media){
            return callback(null);
        }
        // 在新媒体下面随便找一个目录
        db.folder.findOne({ 'parent.$id': media._id }, function(err, activity){
            if(!activity){
                return callback(null);
            }
            var paths = activity.idpath.split(',');
            paths[paths.length - 1] = doc.idpath;
            db.folder.update({ _id: doc._id }, { $set: {
                parent: activity.parent,
                top: activity.top,
                idpath: paths.join(',')
            }}, function(err){
                if(!err){
                    result.push(doc);
                }
                callback(err);
            });
        });
    });
}

exports.fixMediaFolderMissBug = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }
    var result = [];
    db.folder.find({name: /[\w]{16,}/, parent: null}, function(err, docs){
        if(!docs){
            return res.json({ err: ERR.SUCCESS, result: result });
        }
        ep.after('fixDone', docs.length, function(){
            res.json({ err: ERR.SUCCESS, result: result });
        });
        docs.forEach(function(doc){
            fixMediaFolderParent(doc, result, ep.group('fixDone'));
        });
    });
};

exports.initSizegroup = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }

    db.sizegroup.findOne({ }, function(err, doc){
        if(doc){
            return ep.emit('error', 'has init.');
        }

        // 创建个人默认空间组
        doc = {
            name: 'user_default',
            type: 0,
            size: config.DEFAULT_USER_SPACE,
            isDefault: true,
            updateUserId: user._id
        };

        mSizegroup.create(doc, function(err, doc){
            db.user.update({}, {$set: { size: doc.size, sizegroup: new DBRef('sizegroup', doc._id) }},
                    { multi: true }, ep.done('next'));
        });

        // 创建小组默认空间组
        var doc2 = {
            name: 'group_default',
            type: 1,
            size: config.DEFAULT_USER_SPACE,
            isDefault: true,
            updateUserId: user._id
        };
        ep.on('next', function(){
            
            mSizegroup.create(doc2, function(err, doc){
                db.group.update({}, {$set: { size: doc.size, sizegroup: new DBRef('sizegroup', doc._id) }},
                        { multi: true }, ep.done('done'));
            });
        });

        ep.on('done', function(){
            res.json({
                err: ERR.SUCCESS,
                result: {
                    list: [doc, doc2]
                }
            });
        });

    });

    
};


function getSaveFolder(parent, uri, callback){
    console.log('getSaveFolder: ', uri);
    var index = uri.indexOf('/');
    if(index === -1){
        return callback(null, parent, true);
    }
    var dirname = uri.substring(0, index);
    var restname = uri.substring(index + 1);
    var ep = new EventProxy();
    ep.fail(callback);

    db.folder.findOne({ name: dirname, 'parent.$id': parent._id }, function(err, doc){
        if(err){
            return callback(err);
        }
        if(!doc){
            mFolder.create({
                creator: parent.creator.oid,
                name: dirname,
                groupId: parent.group.oid,
                folder: parent
            }, ep.done('folderDone'));
        }else{
            console.log('folder ' + dirname + ' exists');
            ep.emit('folderDone', doc);
        }
    });

    ep.on('folderDone', function(folder){
        getSaveFolder(folder, restname, callback);
    });

}

exports.importPictures = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }
    var dir = req.param('dir'); // '/Users/azrael/Desktop/Test/img/';
    if(!dir){
        return ep.emit('error', 'need import dir');
    }
    var time = Date.now();

    db.group.findOne({ type: 0 }, function(err, school){
        if(!school){
            return ep.emit('error', 'not find a school');
        }
        db.folder.findOne({ _id: school.rootFolder.oid }, function(err, sf){

            var importFolderName = '导入的文件';

            db.folder.findOne({ name: importFolderName, 'parent.$id': sf._id }, function(err, folder){
                if(folder){
                    console.log('already has ' + importFolderName);
                    ep.emit('createFolder', folder);
                }else{
                    mFolder.create({
                        creator: user._id,
                        name: importFolderName,
                        groupId: school._id,
                        folder: sf
                    }, ep.done('createFolder'));
                }
            });

        });
    });

    var files = FileTool.listFilesSync(dir, false, true);

    // ep.after('saveFileSuccess', files.length, function(files){
    //     res.json({ err: ERR.SUCCESS, result: { count: files.length, files: files} });
    // });

    ep.on('createFolder', function(folder){

        var result = [];
        Util.forEach(files, function(uri, i, next){

            if(Util.endsWith(uri, 'Thumbs.db') || Util.endsWith(uri, '.DS_Store')){
                return next();
            }
            var body = {};
            body['file_path'] = path.join(dir, uri);
            body['file_name'] = path.basename(uri);
            var ext = path.extname(uri);

            if(ext){
                ext = ext.substring(1).toLowerCase();
                body['file_content_type'] = config.EXT_TO_CONTENTTYPE[ext] || 'text/plain';
            }else{
                body['file_content_type'] = 'text/plain';
            }

            var content = fs.readFileSync(body['file_path']);
            body['file_size'] = content.length;
            body['file_md5'] = Util.md5(content.toString());

            getSaveFolder(folder, uri, function(err, folder){
                fileHelper.saveUploadFile({
                    folder: folder,
                    loginUser: user,
                    parameter: body,
                    createSWFForDoc: true
                }, function(err, file){
                    if(err){
                        return ep.emit('error', err, file);
                    }
                    result.push(file);
                    next();
                });
            });
        }, function(){
            console.log('-------------------------   importPictures  done, time use: ', Date.now() - time ,' ----------------------');
            res.json({ err: ERR.SUCCESS, result: { count: result.length, time: Date.now() - time } });
        });
    });


};

exports.fixPictureFolderError = function(req, res){
    var user = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        res.json({ err: errCode || ERR.SERVER_ERROR, msg: err});
    });
    if(!Util.hasRight(user.auth, config.AUTH_SYS_MANAGER)){
        return ep.emit('error', 'no auth');
    }

    var ids = [ObjectID("5368da65f7f0f9887716dffa"),ObjectID("5368da66f7f0f9887716e01c"),ObjectID("5368da74f7f0f9887716e1a9"),ObjectID("5368da74f7f0f9887716e1b0"),ObjectID("5368da77f7f0f9887716e21a"),ObjectID("5368da7af7f0f9887716e2c0"),ObjectID("5368da7bf7f0f9887716e2d3"),ObjectID("5368da7cf7f0f9887716e2fb"),ObjectID("5368da80f7f0f9887716e34a"),ObjectID("5368da83f7f0f9887716e3bd"),ObjectID("5368da86f7f0f9887716e415"),ObjectID("5368da86f7f0f9887716e428"),ObjectID("5368da94f7f0f9887716e5fd"),ObjectID("5368da99f7f0f9887716e69d"),ObjectID("5368da9bf7f0f9887716e6e9"),ObjectID("5368da9ff7f0f9887716e765"),ObjectID("5368daa2f7f0f9887716e79c"),ObjectID("5368daa8f7f0f9887716e83c"),ObjectID("5368dab1f7f0f9887716e93c"),ObjectID("5368dab2f7f0f9887716e970"),ObjectID("5368dab8f7f0f9887716ea25"),ObjectID("5368dab8f7f0f9887716ea35"),ObjectID("5368dabaf7f0f9887716ea6c"),ObjectID("5368daccf7f0f9887716ec68"),ObjectID("5368dc9ef7f0f9887717215b"),ObjectID("5368dca2f7f0f988771721d0"),ObjectID("5368dd98f7f0f98877173b0d"),ObjectID("5368dda0f7f0f98877173be6"),ObjectID("5368dda8f7f0f98877173c63"),ObjectID("5368ddaaf7f0f98877173caf"),ObjectID("5368ddabf7f0f98877173ce3"),ObjectID("5368ddb9f7f0f98877173e5e"),ObjectID("5368ddbbf7f0f98877173e77"),ObjectID("5368ddc1f7f0f98877173f17"),ObjectID("5368ddc5f7f0f98877173f8d"),ObjectID("5368dde1f7f0f988771742d0"),ObjectID("5368dde2f7f0f988771742f2"),ObjectID("5368dde4f7f0f98877174329"),ObjectID("5368ddeaf7f0f988771743d5"),ObjectID("5368ddecf7f0f98877174406"),ObjectID("5368ddf0f7f0f98877174461"),ObjectID("5368de0ff7f0f98877174925"),ObjectID("5368de23f7f0f98877174b07"),ObjectID("5368de24f7f0f98877174b1d"),ObjectID("5368de2df7f0f98877174c4a"),ObjectID("5368de38f7f0f98877174d74"),ObjectID("5368de39f7f0f98877174d87"),ObjectID("5368de3ff7f0f98877174e2a"),ObjectID("5368de44f7f0f98877174eb3"),ObjectID("5368de5cf7f0f98877175130"),ObjectID("5368de8bf7f0f988771755b8"),ObjectID("5368de8ff7f0f988771755d1")];

    var parentId = new ObjectID('5368e1c5f7f0f988771755e7');

    ids.forEach(function(id){
        db.folder.update({_id: id}, {$set: {
            'parent.$id': parentId,
            idpath: '5325c25998f4316c2177c46d,5368da64f7f0f9887716dff6,5368e1c5f7f0f988771755e7,' + id.toString()
        }}, function(){
            
        });
    });

    res.json({ err: ERR.SUCCESS });

};
