
var ERR = require('../errorcode');

var mStorage = require('../models/storage');

exports.get = function(req, res){
    
    var key = req.parameter.key;

    mStorage.getConfig({ key: key }, function(err, data){
        if(err){
            return res.json({ err: data || ERR.SERVER_ERROR, msg: err});
        }

        res.json({
            err: ERR.SUCCESS,
            result: {
                data: data
            }
        });
    });

};

exports.set = function(req, res){
    
    var params = req.parameter;

    params.loginUser = req.loginUser;

    mStorage.save(params, function(err, data){
        if(err){
            return res.json({ err: data || ERR.SERVER_ERROR, msg: err});
        }

        res.json({
            err: ERR.SUCCESS,
            result: {
                data: data
            }
        });
    });
};