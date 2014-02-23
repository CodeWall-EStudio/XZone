
// 服务器运行的端口
exports.PORT = 8091;

// 数据库的名字为 xzone, 账号为 xzone_user 密码: HeMHFxTAMPAjlRVH
// 可以自行修改
exports.DB_URI = 'mongodb://xzone_user:HeMHFxTAMPAjlRVH@127.0.0.1:27017/xzone';

// cookie 的加密key
exports.COOKIE_SECRET= 'xzone_HeMHFxTAMPAjlRVH_secret';

// CAS 的配置以及登录成功后的跳转 URL
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';
// for debug
// exports.CAS_SERVICE = 'http://localhost:' + exports.PORT + '/api/user/loginSuccess'; // FIXME need to change 
exports.CAS_SERVICE = 'http://xzone.codewalle.com/api/user/loginSuccess';

// 默认每个用户的空间大小 3G
exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;

// 文件保存的根目录
exports.FILE_SAVE_ROOT = '/home/swall/xzone/';

// 上传的文件保存的目录, 相对于 FILE_SAVE_ROOT
// 文件上传后会保存到 FILE_SAVE_ROOT + FILE_SAVE_DIR 下
exports.FILE_SAVE_DIR = '/data/71xiaoxue/';

// 批量下载时打包成zip包的保存目录, 相对于 FILE_SAVE_ROOT
exports.FILE_ZIP_DIR = '/data/zip/';

// jodconverter 的路径, 用于把doc转换为pdf
exports.JOD_CONVERTER = '/var/run/jodconverter/lib/jodconverter-core-3.0-beta-4.jar';

// 需要转换成swf的文档类型配置
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


// 权限的常量
// 权限 0x0 普通 0x1 小组管理员 0x2 部门管理员 0x4 管理员 0x8 系统管理员
exports.AUTH_USER = 0x0;
exports.AUTH_GROUP_MANAGER = 0X1;
exports.AUTH_DEPART_MANAGER = 0X2;
exports.AUTH_MANAGER = 0X4;
exports.AUTH_SYS_MANAGER = 0X8;




