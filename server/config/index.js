var us = require('underscore');

us.extend(exports, require('./config'));

us.extend(exports, require('./filetypes'));

us.extend(exports, require('./constants'));

var appConfig = null;
// 从上一级目录读取系统的个性配置
try{
    appConfig = require('../../../config');
}catch(e){

}
if(appConfig){
    us.extend(exports, appConfig);
}