var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var EventProxy = require('eventproxy');
var us = require('underscore');

var ERR = require('../errorcode');
var mSizegroup = require('../models/sizegroup');


exports.create = function(req, res){

    var loginUser = req.loginUser;

    var createParams = us.extend({}, req.parameter);

    createParams.updateUserId = loginUser._id;

    // 检查重名
    mSizegroup.getSizegroup({ name: createParams.name }, function(err, result){

        if(err){
            return res.json({ err: result || ERR.SERVER_ERROR, msg: err});
        }
        if(result){
            return res.json({ err: ERR.DUPLICATE, msg: 'name duplicate'});
        }

        mSizegroup.create(createParams, function(err, result){
            if(err){
                return res.json({ err: result || ERR.SERVER_ERROR, msg: err});
            }
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: result
                }
            });
        });
    });


};

exports.modify = function(req, res){

    var params = req.parameter;
    var loginUser = req.loginUser;

    var sizegroup = params.sizegroupId;
    var ep = new EventProxy();
    ep.fail(function(err, errorCode){
        return res.json({ err: errorCode || ERR.SERVER_ERROR, msg: err});
    });

    var doc = {};
    doc.updateUser = new DBRef('user', loginUser._id);

    if(params.size && params.size !== sizegroup.size){
        doc.size = params.size;
    }

    if(params.name && params.name !== sizegroup.name){
        doc.name = params.name;
    }

    if('isDefault' in params){
        doc.isDefault = params.isDefault;
    }

    // 检查重名
    if(doc.name){
        mSizegroup.getSizegroup({ name: doc.name }, ep.doneLater('checkNameDone'));
    }else{
        ep.emitLater('checkNameDone', null);
    }

    ep.on('checkNameDone', function(exists){
        if(exists){
            return res.json({ err: ERR.DUPLICATE, msg: 'name duplicate'});
        }

        mSizegroup.modify({ _id: sizegroup._id, type: sizegroup.type }, doc, function(err, result){
            if(err){
                return res.json({ err: result || ERR.SERVER_ERROR, msg: err});
            }
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: result
                }
            });
        });

    });

};


exports.delete = function(req, res){
    var params = req.parameter;

    var sizegroup = params.sizegroupId;

    mSizegroup.delete({ _id: sizegroup._id }, function(err){
        if(err){
            return res.json({ err: result || ERR.SERVER_ERROR, msg: err});
        }
        res.json({
            err: ERR.SUCCESS
        });
    });
};

exports.search = function(req, res){
    var params = req.parameter;

    mSizegroup.search(params, function(err, total, docs){
        if(err){
            return res.json({ err: result || ERR.SERVER_ERROR, msg: err});
        }
        res.json({
            err: ERR.SUCCESS,
            result: {
                total: total,
                list: docs
            }
        });
    });
};
