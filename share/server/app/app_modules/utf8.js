/**
 * 計算字符串的字節數（不是字符長度，utf8中文字符算3字節）
 * @param {String} str
 * @returns {Number}
 */
function length(str){
    if(str && str.length) return new Buffer(str).length;
    else return 0;
}

function substr(str, start, length){
    return substring(str, start, start+length);
}

function substring(str, start, end){
    if(str && str.length){
        var buf = new Buffer(str);
        if(start < 0) start = 0;
        if(end >= buf.length) end = buf.length;
        while(buf[start] > 127 && buf[start] < 192 && start < buf.length){ /*console.log('+');*/ ++start; }
        while(buf[end] > 127 && buf[end] < 192 && end > 0){ /*console.log('-');*/ --end; }
        if(start >= end) return '';
        else return buf.slice(start, end).toString();
    }
    else return '';
}

exports.length = length;
exports.substr = substr;
exports.substring = substring;