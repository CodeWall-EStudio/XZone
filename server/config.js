
exports.PORT = 8091;

// db config
exports.DB_URI = 'mongodb://xzone_user:HeMHFxTAMPAjlRVH@127.0.0.1:27017/xzone';

// cas config
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';
exports.CAS_SERVICE = 'http://localhost:' + exports.PORT + '/api/user/loginSuccess'; // FIXME need to change 
exports.CAS_SERVICE = 'http://xzone.codewalle.com/api/user/loginSuccess';

exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;


// 文档类型转换的配置
exports.DOC_TYPES = [
        'application/msword',
        'application/vnd.ms-word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.template',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/kswps'
];

exports.PDF_TYPES = ['application/pdf'];

exports.JOD_CONVERTER = '/data/run/jodconverter/lib/jodconverter-core-3.0-beta-4.jar';

// 权限的常量
exports.AUTH_SYS_MANAGER = 15;
exports.AUTH_USER = 0;