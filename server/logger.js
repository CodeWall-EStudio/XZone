var config = require('./config');
var Util = require('./util');

var slice = Array.prototype.slice;

exports.info = function(){
    var args = slice.call(arguments);
    args.unshift('>>>', Util.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'), '\n');
    args.push('<<<\n');
    console.info.apply(console, args);
};

exports.debug = function(){
    if(config.DEBUG){
        var args = slice.call(arguments);
        args.unshift('----\n[debug]>>>>', Util.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),'\n');
        args.push('\n<<<<\n');
        console.log.apply(console, args);
    }
};

exports.error = function(){
    var args = slice.call(arguments);
    args.unshift('>>>\n[error]', Util.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),'\n');
    args.push('\n<<<\n');
    console.error.apply(console, args);
};