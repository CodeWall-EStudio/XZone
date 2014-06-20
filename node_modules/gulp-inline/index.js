/*
 * horde-inline
 *
 * Copyright (c) 2014 horde G. casper & Alloyteam
 */
'use strict';

var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var map = require('map-stream');
var util = require('util');
var path = require('path');
var fs = require('fs');

var PLUGIN_NAME = 'gulp-inline';

module.exports = function () {
	//var tasks = getTasks(arguments);

	var path = arguments[0];
	//var tasks = arguments[1];
    // if(arguments.length === 1){
    //     tasks = path;
    //     path = fs.realpathSync('.');
    // }else if(arguments.length === 0){
    //     map(function(file,callback){
    //         callback(null, file);
    //     });
    //     return;
    // }

    console.log(path);

	var inlineReplace = function (file, callback) {

        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            return callback(new PluginError(PLUGIN_NAME, 'Streaming is not supported yet.'));
        }

	    // var build = '<inline\\s*src=["\']([^"\']+)["\']\\s*';//\/>/;
	    // for(var i in tasks){
	    // 	//console.log(i);
	    // 	build += i+'=["\']([^"\']+)["\']\\s*';
	    // }
	    // build += '[\/]?>';	
     //    var reg = new RegExp(build, "g");

        var sbuild = /<inline\s*src=["']([^"']+)["']\s*[\/]?>/g
        var ebuild = /<inline\s*src=["']([^"']+)["']\s*tab=[\[]([^\]]+)[\]]\s*[\/]?>/g

        ///<inline.+src=["']([^"']+)["']\s*\/>/g
        //读取文件内容
        var content = file.contents.toString();	

        content = content.replace(sbuild,function(matchedWord, src){
            var realfile = path+src;
            var fcontent = fs.readFileSync(realfile, {encoding: 'utf8'});

            return fcontent;
        });

        content = content.replace(ebuild,function(matchedWord,src,rep){
            var realfile = path+src;
            rep = rep.split(':');
            var replaceStr = new RegExp('<!--tab:'+rep[0]+'-->',"g");
            var fcontent = fs.readFileSync(realfile, {encoding: 'utf8'});
            fcontent = fcontent.replace(replaceStr,rep[1]).replace(/<!--tab:\S*-->/g,'');
            return fcontent;
        });

        file.contents = new Buffer(content);
        //console.log(content);
   //      content.replace(reg, function(matchedWord, src){
   //      	var args = arguments;
			// //var inlineFilePath = path.resolve( path.dirname(filepath), src );
   //          var realfile = path+src;
			// console.log('inline >inline file，src = ' + src + ', 实际路径：'+realfile);

			
			// var fcontent = fs.readFileSync(realfile, {encoding: 'utf8'});
   //          var replaceStr;
   //          var idx = 2;
   //          var tabStr = '(';
   //          for(var i in tasks){
   //              tabStr += i+'|';
   //              replaceStr = new RegExp('<!--'+i+':'+args[2]+'-->',"g");
   //              idx++;
   //              fcontent = fcontent.replace(replaceStr,tasks[i]);
   //          }
   //          tabStr += ')';
   //          replaceStr = new RegExp('<!--'+tabStr+':\\S*-->',"g");
   //          fcontent = fcontent.replace(replaceStr,'');

   //          content = content.replace(reg,fcontent);
   //          file.contents = new Buffer(content);
   //      });

        callback(null, file);
	}

	return map(inlineReplace);
}