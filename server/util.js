var fs = require('fs');
var path = require('path');
var util = require('util');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var url = require('url');

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
    return Number(auth) & needAuth;
}

exports.encodeRegexp = function(str){

    return str.replace(/([\.\\\/\+\*\(\)\[\]\?\^\$\|\-])/g, function(u, $1){
        return '\\' + $1;
    });
}

exports.request = function(params, callback){

    var obj = url.parse(params.url);

    var options = {
        hostname: obj.hostname,
        path: obj.path
    };

    options.method = params.method;
    if(params.headers){
        options.headers = params.headers;
    }

    var req = (obj.protocol === 'https:' ? https : http).request(options, function(res){
        res.setEncoding('utf8');
        var response = '';
        res.on('error', callback);
        
        res.on('data', function(chunk){
            response += chunk;
        });
        res.on('end', function(){
            callback(null, response);
        });
    });
    if(options.method === 'POST' && params.data){
        req.write(params.data + '\n');
    }
    req.end();
}

exports.parseCallbackData = function(str){
    var reg = /callback\((.+?)\)/;
    var match = str.match(reg);
    if(match && match[1]){
        try{
            return JSON.parse(match[1]);
        }catch(e){
            return null;
        }
    }
    return null;
}