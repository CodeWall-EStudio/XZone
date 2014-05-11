var MongoClient = require('mongodb').MongoClient;
var EventProxy = require('eventproxy');
var us = require('underscore');

var config = require('../config');
var U = require('../util');
var Logger = require('../logger');

var ins = null;

exports.open = function(callback){

    if(ins){
        callback(null, ins);
        return;
    }
    MongoClient.connect(config.DB_URI, function(err, db){
        if(!err){
            ins = db;
            Logger.info('DB open');
        }else{
            Logger.error('DB open error: ', err);
        }
        callback(err, db);
    });
};

exports.close = function(){
    if(ins){
        ins.close();
        ins = null;
    }
};

exports.getCollection = function(name, callback){
    exports.open(function(err, db){
        if(err){
            callback(err, null);
        }else{
            callback(null, db.collection(name));
        }
    });
};

exports.dereference = function(doc, keys, callback){
    // Logger.debug('dereference: ', doc._id, keys);
    exports.open(function(err, db){
        if(err){
            callback(err, null);
        }else{
            var ep = new EventProxy();
            ep.after('deref', U.objectSize(keys), function(/*list*/){
                // Logger.debug('dereference done: ', doc._id);
                callback(null, doc);
            });
            ep.fail(callback);

            for(var key in keys){

                if(doc[key]){
                    db.dereference(doc[key], ep.group('deref',
                        (function(key, keepProps){

                            return function(data){
                                if(data && keepProps){
                                    doc[key] = {};
                                    keepProps.forEach(function(prop){
                                        doc[key][prop] = data[prop];
                                    });
                                }else if(data){
                                    doc[key] = data;
                                }
                                return null;
                            };
                            
                        }(key, keys[key]))
                    ));
                }else{
                    ep.emit('deref');
                }
            }
        }
    });
};

exports.dereferences = function(docs, keys, callback){
    var ep = new EventProxy();

    ep.after('deref', docs.length, function(/*list*/){
        callback(null, docs);
    });

    ep.fail(callback);

    docs.forEach(function(doc){
        exports.dereference(doc, keys, ep.group('deref'));
    });
};

exports.search = function(collectionName, query, options, callback){
    var order = options.order || null;
    var page = Number(options.page) || 0;
    var pageNum = Number(options.pageNum) || 0;
    var skipNum = pageNum * page;
    if(order){
        order = U.jsonParse(order);
    }

    Logger.info('search:', collectionName, query, order, page, pageNum);
    exports.getCollection(collectionName, function(err, collection){
        
        var cursor = collection.find(query);
        var ep = EventProxy.create('total', 'result', function(total, list){
            Logger.info('search done:', collectionName, query, order, page, pageNum, '\ntotal: ', total);
            callback(null, total || 0, list);
        });
        ep.fail(callback);

        cursor.count(ep.done('total'));

        if(order){
            cursor.sort(order);
        }
        if(skipNum){
            cursor.skip(skipNum);
        }
        if(pageNum){
            cursor.limit(pageNum);
        }
        cursor.toArray(ep.done('result'));
    });
};

exports.batchAddMethod = function(context, collectionName, methods){
    context = context[collectionName] = {};
    methods.forEach(function(method){
        context[method] = function(){
            var argus = Array.prototype.slice.call(arguments);
            exports.getCollection(collectionName, function(err, collection){
                if(method === 'find'){
                    collection[method].apply(collection, argus.slice(0, argus.length - 1))
                            .toArray(argus[argus.length - 1]);
                }else{
                    collection[method].apply(collection, argus);
                }
            });
        }; // end of context[method]
    });
};

exports.addHelper = function(context, collectionName){

    exports.batchAddMethod(context, collectionName, [
        'find',
        'findOne',
        'save',
        'insert',
        'update',
        'remove',
        'count',
        'findAndModify',
        'findAndRemove'
    ]);
};

// add a large of quick access method
exports.addHelper(exports, 'user');
exports.addHelper(exports, 'group');
exports.addHelper(exports, 'resource');
exports.addHelper(exports, 'groupuser');
exports.addHelper(exports, 'file');
exports.addHelper(exports, 'folder');
exports.addHelper(exports, 'fav');
exports.addHelper(exports, 'board');
exports.addHelper(exports, 'message');
exports.addHelper(exports, 'log');
exports.addHelper(exports, 'department');
exports.addHelper(exports, 'departuser');
exports.addHelper(exports, 'storage');
exports.addHelper(exports, 'sizegroup');

