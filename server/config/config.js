var path = require('path');

// debug 模式, 会输出一些调试用的 log
exports.DEBUG = true;

// ==== 服务器相关的配置 ====================================================
// 服务器运行的端口
exports.PORT = 8091;

// 数据库的名字为 xzone, 账号为 xzone_user 密码: HeMHFxTAMPAjlRVH
// 可以自行修改
exports.DB_URI = 'mongodb://xzone_user:HeMHFxTAMPAjlRVH@127.0.0.1:27017/xzone';

// 文件保存的根目录
exports.FILE_SAVE_ROOT = '/home/swall/xzone/';

// 上传的文件保存的目录, 相对于 FILE_SAVE_ROOT
// 文件上传后会保存到 FILE_SAVE_ROOT + FILE_SAVE_DIR 下
exports.FILE_SAVE_DIR = '/data/files/';

// 批量下载时打包成zip包的保存目录, 相对于 FILE_SAVE_ROOT
exports.FILE_ZIP_DIR = '/data/zip/';

// jodconverter 的路径, 用于把doc转换为pdf
exports.JOD_CONVERTER = path.join(__dirname, '../../lib/jodconverter-core-3.0-beta-4.jar');

// ==== 应用自身相关的配置 ====================================================

// 应用运行的域名
exports.APP_DOMAIN = 'http://localhost:8091';

// cookie 的加密key
exports.COOKIE_SECRET= 'xzone_HeMHFxTAMPAjlRVH_secret';

// cookie 的有效时间
exports.COOKIE_TIME = 24 * 60 * 60 * 1000; // 24 小时

exports.STATIC_FILE_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 静态文件的过期时间

// 默认每个用户的空间大小 3G
exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;

// 允许新媒体跨域上传和下载资源的 host
exports.XHR2_ALLOW_ORIGIN = [
    'http://media.71xiaoxue.com',
    'http://swall.codewalle.com'
];

// 下载的接口列表
exports.DOWNLOAD_APIS = [
    '/api/file/download',
    '/api/file/batchDownload'
];

// 多媒体的上传接口
exports.MEDIA_UPLOAD_CGI = '/api/media/upload';

// 多媒体下载接口
exports.MEDIA_DOWNLOAD_CGI = '/api/media/download';


exports.AUTH_TYPE = 'self';// auto, sso, qq, self, huairou

// 一些页面 url 的常量

exports.INDEX_PAGE = '/index.html';

exports.LOGIN_PAGE = '/login.html';

exports.LOGIN_FAIL_PAGE = '/loginfail.html';

exports.NOT_FOUND_PAGE = '/404.html';


// ==== User Center 相关的配置 ====================================================

// 默认新建用户的密码
exports.DEFAULT_USER_PWD = '8888';

exports.USERCENTER_LOGIN_TYPE = 'token'; // pwd, token

exports.USERCENTER_CLIENT_ID = '54321';

exports.USERCENTER_CLIENT_SECRET = '22ff294ea9c161ca843fbc22eafb068b';

exports.USERCENTER_CALLBACK = '/api/login/loginUCSuccess';

exports.USERCENTER_SITE = 'http://localhost:8099';

exports.USERCENTER_AUTH_PATH = '/oauth/authorise';

exports.USERCENTER_TOKEN_PATH = '/oauth/token';

exports.USERCENTER_OPENID_PATH = '/oauth/verify';


