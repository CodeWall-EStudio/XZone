var db = require('./db');

function BaseModel(modelName){
    this.modelName = modelName;
}

BaseModel.prototype = {
    find: function(modelName, query, callback){
        if(arguments.length === 2){
            callback = query;
            query = modelName;
            modelName = this.modelName;
        }
        db.open(function(err, db){
            if(err){
                return callback(err, null);
            }else{
                db.collection(modelName).find(query).toArray(callback);
            }
        });
    },
    findOne: function(modelName, query, callback){
        if(arguments.length === 2){
            callback = query;
            query = modelName;
            modelName = this.modelName;
        }
        db.open(function(err, db){
            if(err){
                return callback(err, null);
            }else{
                db.collection(modelName).findOne(query, callback);
            }
        });
    },
    save: function(modelName, doc, callback){
        if(arguments.length === 2){
            callback = doc;
            doc = modelName;
            modelName = this.modelName;
        }
        db.open(function(err, db){
            if(err){
                return callback(err, null);
            }else{
                db.collection(modelName).save(doc, callback);
            }
        });
    },
    insert: function(modelName, doc, callback){
        if(arguments.length === 2){
            callback = doc;
            doc = modelName;
            modelName = this.modelName;
        }
        db.open(function(err, db){
            if(err){
                return callback(err, null);
            }else{
                db.collection(modelName).insert(doc, callback);
            }
        });
    },
    updateOrSave: function(modelName, query, doc, callback){
        if(arguments.length === 3){
            callback = doc;
            doc = query;
            query = modelName;
            modelName = this.modelName;
        }
        db.open(function(err, db){
            if(err){
                return callback && callback(err, null);
            }else{
                db.collection(modelName).update(query, doc, 
                        { upsert:true }, callback);
            }
        });
    },
    findAndModify: function(modelName, query, doc, callback){
        if(arguments.length === 3){
            callback = doc;
            doc = query;
            query = modelName;
            modelName = this.modelName;
        }
        db.open(function(err, db){
            if(err){
                return callback && callback(err, null);
            }else{
                db.collection(modelName).findAndModify(query, [], doc, 
                        { 'new':true, upsert:true }, callback);
            }
        });
    }
}

module.exports = BaseModel;