
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