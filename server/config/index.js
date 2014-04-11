var us = require('underscore');
var path = require('path');

var Logger = require('../logger');

us.extend(exports, require('./config'));

us.extend(exports, require('./filetypes'));

us.extend(exports, require('./constants'));

var appConfig = null;
// 从上一级目录读取系统的个性配置
try{
    var filename = '../../config.js';
    appConfig = require(filename);
    Logger.info('load custom config, filename: ' + path.resolve(path.join(__dirname, filename)));
}catch(e){
    Logger.info('has\'t assign custom config, use default');
}
if(appConfig){
    us.extend(exports, appConfig);
}