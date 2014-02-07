
exports.PORT = 8091;

// db config
exports.DB_URI = 'mongodb://xzone_user:HeMHFxTAMPAjlRVH@127.0.0.1:27017/xzone';

// cas config
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';
exports.CAS_SERVICE = 'http://localhost:' + exports.PORT + '/api/user/login'; // FIXME need to change 
// exports.CAS_SERVICE = 'http://xzone.codewalle.com/api/user/login';

exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;