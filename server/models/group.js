var db = require('./db');
var EventProxy = require('eventproxy');


exports.getGroupByUser = function(uid, callback){
    db.groupuser.find({ uid: uid }, function(err, docs){
        if(!err){
            return callback(err, null);
        }
        var proxy = new EventProxy();
        proxy.after('getGroup', docs.length, function(list){
            callback(null, list);
        });
        proxy.fail(function(err){
            callback(err, 'get user groups error.');
        })
        docs.forEach(function(doc){

            // TODO 解开 objectid 的引用
            db.dereference(doc.gid, proxy.group('getGroup'));
        });
    });
}   