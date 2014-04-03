
/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var http = require('http');
var path = require('path');

var config = require('./config');
var routes = require('./routes');

var app = express();

// all environments
app.set('port', process.env.PORT || config.PORT);

app.enable('trust proxy');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());

app.use(express.session({
    secret: config.COOKIE_SECRET,
    cookie: { maxAge: 2 * 60 * 60 * 1000 }, // 2 hour
    store: new MongoStore({
        url: config.DB_URI
    }, function () {
        console.log("db connection open");
    })
}));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../web')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// 检查是否登录, 如果没有登录, 跳转到登录页
app.all('/', routes.checkAuthAndLogin);

// 设置跨域请求头
app.all('/', routes.setXHR2Headers);

// 适配多媒体的上传下载
app.all('/api/file/upload', routes.mediaUpload);
app.all('/download', routes.mediaDownload);

// 检查是否登录, 如果登录了, 从数据库把用户信息找出; 没有登录则返回错误
app.all('/api/*', routes.checkAuth);

// 检查参数合法性
app.all('/api/*', routes.checkParams);

// 检查 API 调用权限
app.all('/api/*', routes.checkAPI);

// 路由请求
app.all('/api/*', routes.route);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
