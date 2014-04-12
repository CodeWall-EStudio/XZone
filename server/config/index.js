var us = require('underscore');
var path = require('path');
var fs = require('fs');

var Logger = require('../logger');

us.extend(exports, require('./config'));

us.extend(exports, require('./filetypes'));

us.extend(exports, require('./constants'));

// 从上一级目录(跟 server/ 同级的config.js)读取系统的个性配置
try{
    var filename = '../../config.js';
    var abspath = path.resolve(path.join(__dirname, filename));
    if(fs.existsSync(abspath)){

        us.extend(exports, require(filename));
        Logger.info('load custom config, filename: ' + abspath);
    }else{
        Logger.info('has\'t assign custom config, use default');
    }
}catch(e){
    Logger.error('load custom config error: ', e);
}
