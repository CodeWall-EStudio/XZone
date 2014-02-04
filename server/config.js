
exports.PORT = 3000;

// db config
exports.DB_URI = 'mongodb://127.0.0.1:27017/dand';

// cas config
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';
exports.CAS_SERVICE = 'http://localhost:' + exports.PORT + '/user/login'; //FIXME need to change 

exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;