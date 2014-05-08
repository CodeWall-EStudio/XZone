// !!!! 配置系统, 请修改该文件后另存为 config.js

// debug 模式, 会输出一些调试用的 log
exports.DEBUG = false;

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
exports.APP_DOMAIN = 'http://xzone.codewalle.com';

// 允许新媒体跨域上传和下载资源的 host
exports.XHR2_ALLOW_ORIGIN = [
    'http://media.codewalle.com',
    'http://media.71xiaoxue.com'
];

// ==== SSO登陆相关的配置 ====================================================

exports.AUTH_TYPE = 'qq';// auto, sso, qq

// ==== QQ登陆相关的配置 ====================================================
// ...

