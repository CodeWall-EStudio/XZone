
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
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'xzone' }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// verify authorization
app.all('*', routes.verify);

// route the request
app.all('*', routes.route);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
