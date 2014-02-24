
var http = require('http');
var querystring = require('querystring');
var url = require('url');
var EventProxy = require('eventproxy');

var config = require('../config');


exports.getUserInfo = function(skey, callback){
    var data = querystring.stringify({
        encodeKey: skey
    });

    var options = url.parse(config.CAS_USER_INFO_CGI);

    options.method = 'POST';
    options.headers = {  
        "Content-Type": 'application/x-www-form-urlencoded',  
        "Content-Length": data.length  
    };

    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        var response = '';
        res.on('error', callback);
        
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