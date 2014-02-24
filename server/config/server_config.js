
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

// 获取用户详细资料的CGI
exports.CAS_USER_INFO_CGI = 'http://mapp.71xiaoxue.com/components/getUserInfo.htm';

// 允许新媒体跨域上传和下载资源的 host
exports.MEDIA_CORS_URL = 'http://media.71xiaoxue.com';

// 文件保存的根目录
exports.FILE_SAVE_ROOT = '/home/swall/xzone/';

// 上传的文件保存的目录, 相对于 FILE_SAVE_ROOT
// 文件上传后会保存到 FILE_SAVE_ROOT + FILE_SAVE_DIR 下
exports.FILE_SAVE_DIR = '/data/71xiaoxue/';

// 批量下载时打包成zip包的保存目录, 相对于 FILE_SAVE_ROOT
exports.FILE_ZIP_DIR = '/data/zip/';

// jodconverter 的路径, 用于把doc转换为pdf
exports.JOD_CONVERTER = '/var/run/jodconverter/lib/jodconverter-core-3.0-beta-4.jar';






