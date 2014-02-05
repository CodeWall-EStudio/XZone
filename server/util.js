
exports.calculate = function(arr){
    var result = 0;
    arr.forEach(function(a){
        result += a;
    });
    return result;
}