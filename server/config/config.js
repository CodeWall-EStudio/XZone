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
exports.FILE_SAVE_DIR = '/data/71xiaoxue/';

// 批量下载时打包成zip包的保存目录, 相对于 FILE_SAVE_ROOT
exports.FILE_ZIP_DIR = '/data/zip/';

// jodconverter 的路径, 用于把doc转换为pdf
exports.JOD_CONVERTER = '/var/run/jodconverter/lib/jodconverter-core-3.0-beta-4.jar';

// ==== 应用自身相关的配置 ====================================================

// 应用运行的域名
exports.APP_DOMAIN = 'szone.hylc-edu.cn';//'http://xzone.codewalle.com';

// cookie 的加密key
exports.COOKIE_SECRET= 'xzone_HeMHFxTAMPAjlRVH_secret';

// cookie 的有效时间
exports.COOKIE_TIME = 2 * 60 * 60 * 1000; // 2 小时

exports.STATIC_FILE_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 静态文件的过期时间

// 默认每个用户的空间大小 3G
exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;

exports.NOT_FOUND_PAGE = '/404.html';

// 允许新媒体跨域上传和下载资源的 host
exports.XHR2_ALLOW_ORIGIN = [
    'http://media.71xiaoxue.com'
];

// 下载的接口列表
exports.DOWNLOAD_APIS = [
    '/api/file/download',
    '/api/file/batchDownload'
];

// ==== SSO登陆相关的配置 ====================================================

exports.AUTH_TYPE = 'sso';// auto, sso, qq

// CAS 的配置以及登录成功后的跳转 URL
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';

// 这里要改为对应域名
exports.CAS_SERVICE = exports.APP_DOMAIN + '/api/user/loginSuccess';

// 获取用户详细资料的CGI
exports.CAS_USER_INFO_CGI = 'http://mapp.71xiaoxue.com/components/getUserInfo.htm';

// 获取用户组织列表单cgi
exports.CAS_ORG_TREE_CGI = 'http://mapp.71xiaoxue.com/components/getOrgTree.htm';


// ==== QQ登陆相关的配置 ====================================================
// QQ 互联的 appid
exports.QQ_CONNECT_APPID = '100548719';

// appkey
exports.QQ_CONNECT_APPKEY = '9e47324ac7fed9f8364d4982ccf3037e';

// 登陆成功的回调地址
exports.QQ_CONNECT_CALLBACK = exports.APP_DOMAIN + '/api/user/loginSuccessWithQQ';

exports.QQ_CONNECT_SITE = 'https://graph.qq.com';

exports.QQ_CONNECT_AUTH_PATH = '/oauth2.0/authorize';

exports.QQ_CONNECT_TOKEN_PATH = '/oauth2.0/token';

exports.QQ_CONNECT_OPENID_PATH = '/oauth2.0/me';

exports.QQ_CONNECT_USERINFO_PATH = '/user/get_user_info';

