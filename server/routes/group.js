
var config = require('../config');
var ERR = require('../errorcode');


var mGroup = require('../models/group');

var http = require('http');

var EventProxy = require('eventproxy');



exports.create = function(req, res){
    var params = req.query;
    params.creator = req.loginUser._id;
    
    mGroup.create(params, function(err, group){
        if(err){
            res.json({ err: group || ERR.SERVER_ERROR, msg: err});
        }else{
            res.json({
                err: ERR.SUCCESS,
                result: {
                    data: group
                }
            });
        }
    });

}
