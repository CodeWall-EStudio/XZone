
// 默认每个用户的空间大小 3G
exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;

// 权限的常量
// 权限 0x0 普通 0x1 小组管理员 0x2 部门管理员 0x4 管理员 0x8 系统管理员
exports.AUTH_USER = 0x0;
exports.AUTH_GROUP_MANAGER = 0x1;
exports.AUTH_DEPART_MANAGER = 0x2;
exports.AUTH_MANAGER = 0x4;
exports.AUTH_SYS_MANAGER = 0x8;

exports.AUTH_TYPE = 'auto';// auto, sso, qq

// CAS 的配置以及登录成功后的跳转 URL
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';

exports.CAS_SERVICE = 'http://xzone.codewalle.com/api/user/loginSuccess';
//exports.CAS_SERVICE = 'http://localhost:8091/api/user/loginSuccess';

// 获取用户详细资料的CGI
exports.CAS_USER_INFO_CGI = 'http://mapp.71xiaoxue.com/components/getUserInfo.htm';

// 允许新媒体跨域上传和下载资源的 host
exports.MEDIA_CORS_URL = 'http://media.71xiaoxue.com';

// QQ 互联的 appid
exports.QQ_CONNECT_APPID = '100548719';

// appkey
exports.QQ_CONNECT_APPKEY = '9e47324ac7fed9f8364d4982ccf3037e';

exports.QQ_CONNECT_SITE = 'https://graph.qq.com';

exports.QQ_CONNECT_AUTH_PATH = '/oauth2.0/authorize';

exports.QQ_CONNECT_TOKEN_PATH = '/oauth2.0/token';

exports.QQ_CONNECT_CALLBACK = 'http://xzone.codewalle.com/api/user/loginSuccessWithQQ';

exports.QQ_CONNECT_OPENID_PATH = '/oauth2.0/me';

exports.QQ_CONNECT_USERINFO_PATH = '/user/get_user_info';

exports.NOT_FOUND_PAGE = '/404.html';

