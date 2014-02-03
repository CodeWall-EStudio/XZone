var db = require('./db');

var table = 'user';
var gtable = 'groupuser';

/*
 * mongodb 用的是 ObjectID, 这里是要用 mongodb的还是自定义一个?
 * 
 */
exports.getById = function(id, callback){
    var collection = db.collection('user');
    collection.findOne({"id": id}, function(err, doc) {
        if(!err && doc){
            doc['real_size'] = doc['size'];
            doc['real_used'] = doc['used'];
            doc['per'] = Math.round(doc['real_used'] / doc['real_size'] * 100, 2);
            doc['size'] = formatSize(doc['real_size']);
            doc['used'] = formatSize(doc['real_used']);
            callback(null, doc);
        }else{

            // 出错了或者用户不存在
            callback(err, doc);
        }
    });
}

exports.getByName = function(name, callback){
    var collection = db.collection('user');
    collection.find({"name": name}).toArray(function(err, docs) {
        if(!err){
            
            // 一些其他处理
            callback(null, docs);
        }
    });
}

