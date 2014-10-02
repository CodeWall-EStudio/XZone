#!/usr/bin/expect

set timeout 300

spawn mongo --host 127.0.0.1 --port 27017
expect "connecting to: 127.0.0.1:27017/test"
send "use xzone\r"
expect "switched to db xzone"
send "db.addUser('xzone_user', 'HeMHFxTAMPAjlRVH')\r"
expect "_id"
send "db.auth('xzone_user', 'HeMHFxTAMPAjlRVH')\r"
expect "1"
send "exit\r"
expect eof
