var config = require('../config');
var MongoClient = require('mongodb').MongoClient;
var ins = null;

exports.open = function(callback){

    if(ins){
        callback(null, ins);
        return;
    }
    MongoClient.connect(config.DB_URI, function(err, db){
        if(!err){
            ins = db;
        }else{
            console.log('DB open error: ', err);
        }
        callback(err, db);
    });
}

exports.close = function(){
    if(ins){
        ins.close();
        ins = null;
    }
}

// test code
// 
// exports.open(function(err, db){
//     if(!err){
//         var collection = db.collection('test_insert');
//         collection.insert({a:2}, function(err, docs) {
            
//           collection.count(function(err, count) {
//             console.log(count);
//           });

//           // Locate all the entries using find
//           collection.find().toArray(function(err, results) {
//             console.dir(results);
//             // Let's close the db
//             db.close();
//           });
//         });
//     }else{
//         console.log(err);
//     }
// })