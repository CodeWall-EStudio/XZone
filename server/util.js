var fs = require('fs'),
    path = require('path'),
    util = require('util');


exports.calculate = function(arr){
    var result = 0;
    arr.forEach(function(a){
        result += a;
    });
    return result;
}

exports.filterProp = function(data, props){
    var obj = {};
    if(props){
        props.forEach(function(prop){
            obj[prop] = data[prop];
        });
        return obj;
    }else{
        return data;
    }
}

exports.objectSize = function(obj){
    var count = 0;
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            count++;
        }
    }
    return count;
}

/**
 * 格式化日期
 * @param {Date} date
 * @param {String} format "yyyy-MM-dd hh:mm:ss"
 */
exports.formatDate = function(date, format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" : date.getMonth() + 1, // month
        "d+" : date.getDate(), // day
        "h+" : date.getHours(), // hour
        "m+" : date.getMinutes(), // minute
        "s+" : date.getSeconds(), // second
        "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
        "S" : date.getMilliseconds()
            // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
                - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}


/**
 * 创建多级目录
 * @param  {String} dirpath 路径
 * @param  {String} mode    模式
 */
exports.mkdirsSync = function(dirpath, mode) {

    dirpath = path.resolve(dirpath);

    if(fs.existsSync(dirpath)){
        return;
    }
    var dirs = dirpath.split(path.sep);

    var dir = '';
    for(var i = 0; i < dirs.length; i++) {
        dir += path.join(dirs[i],path.sep);

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, mode);
        }
    }
};

exports.moveFile = function(src, dst, callback){
    var is = fs.createReadStream(src)
    var os = fs.createWriteStream(dst);

    is.on('end', function(){
        fs.unlinkSync(src);
        callback(null);
    });
    os.on('error', function(err){
        callback(err);
    });

    is.pipe(os);
}

exports.jsonParse = function(jsonStr){
    return Function('return ' + jsonStr)();
}

exports.hasRight = function(auth, needAuth){
    return auth & needAuth;
}

exports.encodeRegexp = function(str){

    return str.replace(/([\.\\\/\+\*\(\)\[\]\?\^\$\|\-])/g, function(u, $1){
        return '\\' + $1;
    });
}