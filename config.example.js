
// debug 模式, 会输出一些调试用的 log
exports.DEBUG = true;

// ==== 服务器相关的配置 ====================================================
// 服务器运行的端口, 一般情况下不用改
exports.PORT = 8091;

// 数据库的名字为 xzone, 账号为 xzone_user 密码: HeMHFxTAMPAjlRVH
exports.DB_URI = 'mongodb://xzone_user:HeMHFxTAMPAjlRVH@127.0.0.1:27017/xzone';

// 上传的文件保存的根目录
exports.FILE_SAVE_ROOT = '/data/project_data/Szone/';

// ==== 应用自身相关的配置 ====================================================

// 应用运行的域名
exports.APP_DOMAIN = 'http://xzone.codewalle.com';

// cookie 的有效时间
exports.COOKIE_TIME = 24 * 60 * 60 * 1000; // 24 小时

exports.STATIC_FILE_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 静态文件的过期时间

/**
 * 允许新媒体跨域上传和下载资源的 host
 * 如: 
 * exports.XHR2_ALLOW_ORIGIN = [
    'http://media.71xiaoxue.com',
    'http://swall.codewalle.com'
];
 */
exports.XHR2_ALLOW_ORIGIN = [];


// 用户验证方式, self: 系统自带的用户中心, sso: 对接已有的第三方登录系统, qq: 使用QQ账号登陆
exports.AUTH_TYPE = 'self';// sso, qq, self

// ==== User Center 相关的配置 ====================================================

// 默认新建用户的密码
exports.DEFAULT_USER_PWD = '8888';

// ==== SSO登陆相关的配置 ====================================================
/*
// CAS 的配置以及登录成功后的跳转 URL
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';

// 这里要改为对应域名
exports.CAS_SERVICE = '/api/user/loginSuccess';

// 获取用户详细资料的CGI
exports.CAS_USER_INFO_CGI = 'http://mapp.71xiaoxue.com/components/getUserInfo.htm';

// 获取用户组织列表单cgi
exports.CAS_ORG_TREE_CGI = 'http://mapp.71xiaoxue.com/components/getOrgTree.htm';

*/
// ==== QQ登陆相关的配置 ====================================================

/*// QQ 互联的 appid
exports.QQ_CONNECT_APPID = '100548719';

// appkey
exports.QQ_CONNECT_APPKEY = '9e47324ac7fed9f8364d4982ccf3037e';

// 登陆成功的回调地址
exports.QQ_CONNECT_CALLBACK = '/api/user/loginSuccessWithQQ';

exports.QQ_CONNECT_SITE = 'https://graph.qq.com';

exports.QQ_CONNECT_AUTH_PATH = '/oauth2.0/authorize';

exports.QQ_CONNECT_TOKEN_PATH = '/oauth2.0/token';

exports.QQ_CONNECT_OPENID_PATH = '/oauth2.0/me';

exports.QQ_CONNECT_USERINFO_PATH = '/user/get_user_info';

*/