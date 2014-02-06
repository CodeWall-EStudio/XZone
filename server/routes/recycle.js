
var config = require('../config');
var ERR = require('../errorcode');

var mFile = require('../models/file');

exports.delete = function(req, res){
    var params = req.query;

    var fileId = params.fileId;
    var groupId = params.groupId;

    mFile.delete(params, function(err){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: 'delete failure' });
        }else{
            res.json({ err: ERR.SUCCESS });
        }
    });
}

exports.revert = function(req, res){

    var params = req.query;

    var fileId = params.fileId;
    var groupId = params.groupId;

    var collectionName = groupId ? 'groupfile' : 'userfile';

    db[collectionName].findAndModify({ _id: ObjectID(fileId) }, [], { $set: { del: false } }, function(err, doc){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                }
            });
        }
    });
}


exports.search = function(params, callback){
    var folderId = params.folderId;
    var groupId = params.groupId || 0;
    var keyword = params.keyword || '';
    var type = Number(params.type) || 0; // FIXME 按类型分类未实现

    var order = params.order || [];
    var page = Number(params.page) || 1;
    var pageNum = Number(params.pageNum) || 0;
    var skipNum = pageNum * (page - 1);

    var hasGroupId = groupId && groupId.length === 24;
    var collectionName = hasGroupId ? 'groupfile' : 'userfile';

    db.getCollection(collectionName, function(err, collection){
        var query = { 
            name: new RegExp('.*' + keyword + '.*'),
            fdid: folderId,
            del: false
        };

        var cursor = collection.find(query);
        var proxy = EventProxy.create('total', 'result', function(total, result){
            callback(null, total || 0, result);
        });
        proxy.fail(callback);

        cursor.count(proxy.done('total'));
        cursor.sort(order);
        if(skipNum){
            cursor.skip(skipNum);
        }
        if(pageNum){
            cursor.limit(pageNum);
        }
        cursor.toArray(proxy.done('result'));

    });
}
