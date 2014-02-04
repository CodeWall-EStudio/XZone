var db = require('./db');

function BaseModel(dbName){
    this.dbName = dbName;
}

BaseModel.prototype = {
    find: function(query, callback){
        var that = this;
        db.open(function(err, db){
            if(err){
                return callback(err, null);
            }else{
                db.collection(that.dbName).find(query).toArray(callback);
            }
        });
    },
    findOne: function(query, callback){
        var that = this;
        db.open(function(err, db){
            if(err){
                return callback(err, null);
            }else{
                db.collection(that.dbName).findOne(query, callback);
            }
        });
    },
    save: function(doc, callback){
        var that = this;
        db.open(function(err, db){
            if(err){
                return callback && callback(err, null);
            }else{
                db.collection(that.dbName).save(doc, callback);
            }
        });
    }
}

module.exports = BaseModel;