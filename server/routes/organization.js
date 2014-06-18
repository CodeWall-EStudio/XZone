var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var us = require('underscore');
var EventProxy = require('eventproxy');

var db = require('../models/db');
var config = require('../config');
var ERR = require('../errorcode');
var mUser = require('../models/user');
var mOrganization = require('../models/organization');
var Util = require('../util');

exports.create = function(req, res){
    var params = req.parameter;
    var parent = params.parentId;
    var order = params.order;
    var name = params.name;

    var loginUser = req.loginUser;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        return res.json({ err: errCode || ERR.SERVER_ERROR, msg: err });
    });

    if(parent){

        mOrganization.getUsers(parent._id, { fetchDetail: false }, ep.doneLater('getUsersDone'));
    }else{
        ep.emitLater('getUsersDone', []);
    }

    ep.on('getUsersDone', function(users){
        if(users && users.length){
            return ep.emit('error', 'this organization is not empty, it has user', ERR.NOT_EMPTY);
        }

        mOrganization.create({
            name: name,
            order: order,
            parentId: parent && parent._id,
            creator: loginUser._id
        }, ep.done('createDone'));
    });

    ep.on('createDone', function(dep){
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: dep
            }
        });
    });

};

exports.addUser = function(req, res){
    var params = req.parameter;
    var user = params.userId;
    var organ = params.organizationId;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        return res.json({ err: errCode || ERR.SERVER_ERROR, msg: err });
    });


    mOrganization.getChildren(organ._id, {}, ep.doneLater('getChildrenDone'));

    ep.on('getChildrenDone', function(list){
        if(list && list.length){
            return ep.emit('error', 'addUser failure, this organization has child', ERR.UNINSERTABLE);
        }
        mOrganization.addUser({
            userId: user._id,
            organizationId: organ._id
        }, ep.done('addUserDone'));
    });

    ep.on('addUserDone', function(result){
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: result
            }
        });
    });

};

exports.removeUser = function(req, res){
    var params = req.parameter;
    var user = params.userId;
    var organ = params.organizationId;

    var ep = new EventProxy();
    ep.fail(function(err, errCode){
        return res.json({ err: errCode || ERR.SERVER_ERROR, msg: err });
    });

    mOrganization.removeUser({
        userId: user._id,
        organizationId: organ._id
    }, ep.done('removeUserDone'));

    ep.on('removeUserDone', function(){
        res.json({
            err: ERR.SUCCESS,
            msg: 'ok'
        });
    });
};

exports.modify = function(req, res){
    var params = req.parameter;
    var name = params.name;
    var order = params.order;
    var organization = params.organizationId;

    var doc = {};
    if(name){
        doc.name = name;
    }
    if('order' in params){
        doc.order = order;
    }

    mOrganization.modify({ _id: organization._id }, doc, function(err, result){
        if(err){
            return res.json({ err: errCode || ERR.SERVER_ERROR, msg: err });
        }
        res.json({
            err: ERR.SUCCESS,
            result: {
                data: result
            }
        });
    });
};

exports.delete = function(req, res){
    var params = req.parameter;

    var organ = params.organizationId;
    var ep = new EventProxy();

    mOrganization.getChildren(organ._id, {}, ep.doneLater('getChildrenDone'));

    mOrganization.getUsers(organ._id, { fetchDetail: false }, ep.doneLater('getUsersDone'));


    ep.all('getChildrenDone', 'getUsersDone', function(deps, users){
        if(deps && deps.length){
            return ep.emit('error', 'this organization has child', ERR.NOT_EMPTY);
        }
        if(users && users.length){
            return ep.emit('error', 'this organization has user', ERR.NOT_EMPTY);
        }

        mOrganization.delete({
            _id: organ._id
        }, ep.done('deleteDone'));
    });

    ep.on('deleteDone', function(){
        res.json({
            err: ERR.SUCCESS,
            msg: 'ok'
        });
    });
};

exports.tree = function(req, res){
    var params = req.parameter;

    // params.fetchUser = false;

    mOrganization.getOrganizationTree(params, function(err, data){
        if(err){
            res.json({ err: ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: data
                }
            });
        }
    });
};

exports.search = function(req, res){
    // TODO
    res.json({ err: ERR.SERVER_ERROR, msg: 'not ready'});
};
