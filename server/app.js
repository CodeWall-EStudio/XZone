
/**
 * Module dependencies.
 */

var express = require('express');
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
app.use(express.cookieSession({ secret: 'xzone' }));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../web')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('/', routes.verifyAndLogin);

// verify authorization
app.all('/api/*', routes.verify);

// route the request
app.all('/api/*', routes.route);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
