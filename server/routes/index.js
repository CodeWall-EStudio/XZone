var us = require('underscore');

var ERR = require('../errorcode');
var config = require('../config');

us.extend(exports, require('./param_verify'));

us.extend(exports, require('./auth_verify'));


var MEDIA_UPLOAD_CGI = '/api/media/upload';
var MEDIA_DOWNLOAD_CGI = '/api/media/download';

function getRouter(path, method){

    var arr = path.split('/'), module;
    try{
        if(arr[1] === 'api'){
            module = require('./' + arr[2]);
            if(arr[3]){
                return module[arr[3]];
            }else{
                return module[method.toLowerCase()];
            }
        }
    }catch(e){
        console.error('getRouter(', path, method, ') Error: ', e.message);
    }
    return null;
}

exports.route = function(req, res, next){
    var path = req.redirectPath || req.path;
    var method = req.method;

    var router = getRouter(path, method);
    if (router) {

        router(req, res, next);
    } else {
        next();
    }
};

exports.setXHR2Headers = function(req, res, next){
    var origin = req.headers['origin'];
    var method = req.method;
    var index;
    if ( (index = config.XHR2_ALLOW_ORIGIN.indexOf(origin) ) > -1) {

        res.setHeader('Access-Control-Allow-Origin', config.XHR2_ALLOW_ORIGIN[index]);
        res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'origin,content-type');
        res.setHeader('Access-Control-Max-Age', '30');
    }
    if (method === 'OPTIONS') {

        res.send(200);
    } else {
        next();
    }
};

exports.mediaUpload = function(req, res, next){

    var type = req.param('media', 0);

    if (type === 1) {
        req.redirectPath = MEDIA_UPLOAD_CGI;
    }
    next();
};


exports.mediaDownload = function(req, res, next){
    var fileId = req.param('fileId', '');

    var skey = req.cookies.skey || req.body.skey || req.query.skey;
    if(!skey){
        skey = req.cookies.accessToken || req.body.accessToken || req.query.accessToken;
    }
    skey = skey || '';

    var url = MEDIA_DOWNLOAD_CGI + '?fileId=' + fileId + '&skey=' + skey;
    res.redirect(url);

};


