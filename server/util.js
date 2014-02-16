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

exports.formatFileType = function(mimes){
    switch(mimes){
        // archives
        case 'application/x-gzip':
        case 'application/x-bzip2':
        case 'application/zip':
        case 'application/x-rar':
        case 'application/x-7z-compressed':
            return 6;
        // documents
        case 'application/postscript':
        case 'application/vnd.msword':
        case 'application/vnd.ms-word':
        case 'application/vnd.ms-excel':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.openxmlformats-officedocument.presentationml.template':
        case 'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
        case 'application/kswps':
        case 'application/pdf':
        case 'application/xml':
        case 'application/vnd.oasis.opendocument.text':
        case 'application/x-shockwave-flash':
        case 'application/vnd.openxmlformats-officedocument.wordprocessing':
            return 2;
        // texts
        case 'text/plain':
        case 'text/x-php':
        case 'text/html':
        case 'text/javascript':
        case 'text/css':
        case 'text/rtf':
        case 'text/rtfd':
        case 'text/x-python':
        case 'text/x-java-source':
        case 'text/x-ruby':
        case 'text/x-shellscript':
        case 'text/x-perl':
        case 'text/x-sql':
            return 2;
            // images
        case 'image/x-ms-bmp':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/png':
        case 'image/tiff':
        case 'image/x-targa':
        case 'image/vnd.adobe.photoshop':
            return 1;
            //audio
        case 'audio/mpeg':
        case 'audio/midi':
        case 'audio/ogg':
        case 'audio/mp4':
        case 'audio/wav':
        case 'audio/x-ms-wma':
            return 3;
            // video
        case 'video/x-msvideo':
        case 'video/x-dv':
        case 'video/mp4':
        case 'video/mpeg':
        case 'video/quicktime':
        case 'video/x-ms-wmv':
        case 'video/x-flv':
        case 'video/x-matroska':
            return 4;
        case 'application/octet-stream':
            return 5;
        default:
            return 0;
    }
}
