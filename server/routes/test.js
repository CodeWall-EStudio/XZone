
var mFile = require('../models/file');
var mFolder = require('../models/folder');
var mGroup = require('../models/group');
var mUser = require('../models/user');
var EventEmitter = require('events').EventEmitter;

var evt = new EventEmitter();

function buildCallback(caseName){
    return function(err, data){
        console.log('>>', caseName, err == null, data != null);
        if(err){
            console.log(caseName, '<<<<<', err);
        }else{
            evt.emit(caseName, data);
        }
    }
}

function testCase(){
    var uid = "52f2f10071086909323f2610";
    var resourceId = "52f335432886844d36195710";

    function createFiles(folder, group){

        mFile.create({
            folderId: folder._id.toString(),
            groupId: group && group._id.toString(),
            resourceId: resourceId,
            creator: uid,
            name: '测试文件1',
            status: 0
        }, buildCallback('create file 1'));
        mFile.create({
            folderId: folder._id.toString(),
            groupId: group && group._id.toString(),
            resourceId: resourceId,
            creator: uid,
            name: '读书三到',
            status: 0
        }, buildCallback('create file 2'));
        mFile.create({
            folderId: folder._id.toString(),
            groupId: group && group._id.toString(),
            resourceId: resourceId,
            creator: uid,
            name: '嘎嘎嘎',
            status: 0
        }, buildCallback('create file 3'));
        mFile.create({
            folderId: folder._id.toString(),
            groupId: group && group._id.toString(),
            resourceId: resourceId,
            creator: uid,
            name: '匹配单独',
            status: 1
        }, buildCallback('create file 4'));
    }

    // 创建初始用户
    mUser.save({
        nick: "李佳",
        name: "lijia",
        auth: 0,
        size: 3221225472,
        used: 0,
        lastGroup: null,
        _id: uid
    }, buildCallback('save user'));

    evt.on('create folder', function(folder){
        createFiles(folder);

        evt.on('create user folder1', function(folder){
            mFolder.create({
                name: 'def地方',
                creator: uid,
                folderId: folder._id.toString()
            }, buildCallback('create user sub folder1'));
        });

        mFolder.create({
            name: 'abc阿百川',
            creator: uid,
            folderId: folder._id.toString()
        }, buildCallback('create user folder1'));
    });

    // 创建用户文件夹
    mFolder.create({
        name: '测试文件夹1',
        creator: uid,
        mark: '我是mark'
    }, buildCallback('create folder'));

    evt.on('create group', function(group){

        mGroup.addUserToGroup({
            uid: uid,
            groupId: group._id.toString()
        }, buildCallback('addUserToGroup'));

        mFolder.getFolder(group.rootFolder.oid.toString(), function(err, folder){
            createFiles(folder, group);
        });

        mFolder.create({
            name: '小组的测试文件夹1',
            creator: uid,
            mark: '我是mark',
            groupId: group._id.toString(),
            folderId: group.rootFolder.oid.toString()
        }, buildCallback('create group folder1'));

        mFolder.create({
            name: '撒旦法的',
            creator: uid,
            mark: '我是mark',
            groupId: group._id.toString(),
            folderId: group.rootFolder.oid.toString()
        }, buildCallback('create group folder2'));

        mFolder.create({
            name: '反反复复发',
            creator: uid,
            mark: '我是mark',
            groupId: group._id.toString(),
            folderId: group.rootFolder.oid.toString()
        }, buildCallback('create group folder3'));

        mFolder.create({
            name: '啊啊啊啊啊3',
            creator: uid,
            mark: '我是mark',
            groupId: group._id.toString(),
            folderId: group.rootFolder.oid.toString()
        }, buildCallback('create group folder4'));


    });

    // 创建用户小组
    mGroup.create({
        name: '测试小组',
        creator: uid,
        content: '啥啥?'
    }, buildCallback('create group'))

}

exports.get = function(req, res){
    testCase();
}
testCase();