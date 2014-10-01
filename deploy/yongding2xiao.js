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


// 阿里云的测试环境


// ssh root@112.126.66.147


// 2eefc9e3



var IP = '112.126.66.147';
var USER = 'root';
var PWD = '2eefc9e3';

var Util = require('../server/util.js');


var spawn = require('child_process').spawn;
// var exec = require('child_process').exec;
// var child;

// child = exec('ssh -tt ' + USER + '@' + IP,
//   function (error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
// });

var ssh = spawn('ssh', ['-tt', USER + '@' + IP]);
ssh.on('message', function(data){
    console.log('message: ' + data);
})

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
