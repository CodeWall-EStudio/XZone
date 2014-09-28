// 代码统一放在/data/project
// 数据放在/data/project_data
// 数据库放在/data/dbdata/

// X光 2014/9/22 22:39:49
// 各个代码就用
// /data/prject/Media
// /data/prject/Szone
// /data/prject/User_center

// ssh root@58.117.151.6
// 69802847

var IP = '58.117.151.6';
var USER = 'root';
var PWD = '69802847';

var Util = require('../server/util.js');

// var process = require('process');
var spawn = require('child_process').spawn;

var ssh = spawn('ssh', ['-tt', USER + '@' + IP]);


ssh.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
    if (Util.endsWith(data, ' password:')) {
        console.log('333');
        ssh.stdin.write(PWD);
    }
});

ssh.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
});

ssh.on('exit', function(code) {
    console.log('child process exited with code ' + code);
});
process.stdin.resume();

process.stdin.on('data', function(data){
    console.log('process.stdin: ' + data);
});
process.stdout.on('data', function(data){
    console.log('process.stdout: ' + data);
});
process.stderr.on('data', function(data){
    console.log('process.stderr: ' + data);
});