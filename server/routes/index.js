var ERR = require('../errorcode')

var WHITE_LIST = [
    '/api/user/login',
    '/api/user/gotoLogin'
];

function getRouter(path, method){

    var arr = path.split('/');
    if(arr[1] === 'api'){
        var module = require('./' + arr[2]);
        if(arr[3]){
            return module[arr[3]];
        }else{
            return module[method.toLowerCase()];
        }
    }
    return null;
}

exports.verify = function(req, res, next){
    if(WHITE_LIST.indexOf(req.path) >= 0){
        next();
    }else{
        var skey = req.cookies.skey;
        var loginUser = req.session[skey];

        if(!loginUser){
            res.json({err: ERR.NOT_LOGIN, msg: 'not login'});
        }else{
            req.loginUser = loginUser;
            next();
        }
    }
}

exports.route = function(req, res, next){
    var router = getRouter(req.path, req.method);
    if(router){
        router(req, res, next);
    }else{
        next();
    }
};