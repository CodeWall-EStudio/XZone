var db = require('./db');
var BaseModel = require('./basemodel');
var EventProxy = require('eventproxy');


module.exports = exports = new BaseModel('group');


exports.listUserGroups = function(query, callback){
    db.open(function(err, db){
        db.collection('groupuser').find(query).toArray(function(err, docs){
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

                // 解开 objectid 的引用
                db.dereference(doc.gid, proxy.group('getGroup'));
            });
        });
    })
}   