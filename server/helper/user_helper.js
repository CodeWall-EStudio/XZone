
var http = require('http');
var querystring = require('querystring');
var EventProxy = require('eventproxy');


exports.getUserInfo = function(skey, callback){
    var data = querystring.stringify({
        encodeKey: skey
    });
    var req = http.request({
        host: 'mapp.71xiaoxue.com',
        path: '/components/getUserInfo.htm',
        method: 'POST',
        headers: {  
            "Content-Type": 'application/x-www-form-urlencoded',  
            "Content-Length": data.length  
        }  
    }, function(res){
        res.setEncoding('utf8');
        var response = '';
        res.on('data', function(chunk){
            response += chunk;
        });
        res.on('end', function(){
            try{
                callback(null, JSON.parse(response));
            }catch(e){
                console.err('getUserInfo error: ', e, ' response: ', response);
                callback('sso error: can not get user info');
            }
            
        });
    });
    req.write(data + '\n');
    req.end();
}