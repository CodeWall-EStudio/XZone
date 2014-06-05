var fs = require('fs');

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
    inline = require('gulp-inline'),
    htmlreplace = require('gulp-html-replace'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    es = require('event-stream'),
    compass = require('gulp-compass');
var rjs = require('gulp-requirejs');

var src = './src';
var dist = './dist';

var cssList = ["./src/css/bootstrap.css","./src/css/jquery.ui.min.css","./src/css/base.css","./src/css/common.css","./src/css/icon.css","./src/css/tips.css","./src/css/list.css","./src/css/upload.css","./src/css/manage.css","./src/css/share.css","./src/css/scroll.css","./src/css/type.css","./src/css/messenger.css","./src/css/messenger-spinner.css","./src/css/messenger-theme-air.css","./src/css/messenger-theme-block.css","./src/css/messenger-theme-flat.css","./src/css/messenger-theme-future.css","./src/css/messenger-theme-ice.css","./src/css/jquery.jqplot.css","./src/css/css/pickmeup.min.css","./src/css/jquery.plupload.queue.css"];
var mcssList = ["./src/css/bootstrap.css","./src/css/jquery.ui.min.css","./src/css/base.css","./src/css/common.css","./src/css/icon.css","./src/css/tips.css","./src/css/list.css","./src/css/upload.css","./src/css/manage.css","./src/css/share.css","./src/css/scroll.css","./src/css/type.css","./src/css/messenger.css","./src/css/messenger-spinner.css","./src/css/messenger-theme-air.css","./src/css/messenger-theme-block.css","./src/css/messenger-theme-flat.css","./src/css/messenger-theme-future.css","./src/css/messenger-theme-ice.css","./src/css/jquery.jqplot.css","./src/css/css/pickmeup.min.css"];
var rcssList = ["./src/css/bootstrap.css","./src/css/review.css","./src/css/player/video-js.min.css"];

gulp.task('requirejs',function(){

		//baseUrl: 'path/to/your/base/file.js',
        //out: 'FILENAME\_TO\_BE\_OUTPUTTED',
	  rjs({
		name : '../main',
		baseUrl: './src/js/school',
		out: 'main.js',
  	    mainConfigFile: './src/js/main.js',
		shim: {}
	  })
	  .pipe(gulp.dest('./web/js'));

	  rjs({
		name : '../review',
		baseUrl: './src/js/school',
		out: 'review.js',
  	    mainConfigFile: './src/js/review.js',
		shim: {}
	  })
	  .pipe(gulp.dest('./web/js'));

	  rjs({
		name : '../manage',
		baseUrl: './src/js/manage',
		out: 'manage.js',
  	    mainConfigFile: './src/js/manage.js',
		shim: {}
	  })
	  .pipe(gulp.dest('./web/js'));

});

gulp.task('concat',function(){
  gulp.src(cssList)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./web/css/'));
  gulp.src(mcssList)
    .pipe(concat('manage.css'))
    .pipe(gulp.dest('./web/css/'));
  gulp.src(rcssList)
    .pipe(concat('review.css'))
    .pipe(gulp.dest('./web/css/'));

});

gulp.task('build',function(){
  gulp.src('src/*.html')
    .pipe(replace('%TimeStamp%',new Date().getTime()))
    .pipe(htmlreplace({    
      'maincss' : 'css/main.css?t='+new Date().getTime(),
      'reviewcss' : 'css/review.css?t='+new Date().getTime(),
      'managecss' : 'css/manage.css?t='+new Date().getTime()
    }))
    .pipe(gulp.dest('./web/'));  
});

gulp.task('copy',function(){
  gulp.src('./src/js/player/**')
    .pipe(gulp.dest('./web/js/player')); 
  gulp.src('./src/js/lib/**')
    .pipe(gulp.dest('./web/js/lib')); 
  gulp.src('./src/css/imgs/**')
    .pipe(gulp.dest('./web/css/imgs'));
  gulp.src('./src/css/img/**')
    .pipe(gulp.dest('./web/css/img'));  
  gulp.src('./src/css/player/**')
    .pipe(gulp.dest('./web/css/player')); 
  gulp.src('./src/tmpl/**')
    .pipe(gulp.dest('./web/tmpl'));
});

gulp.task('watch',function(){
  gulp.watch('./src/js/**',['requirejs','concat']);
  gulp.watch('./src/css/**',['concat','copy']);  
  gulp.watch('./src/*.html',['build']);
});

gulp.task('default', ['requirejs','concat','build','copy','watch'], function() {
  console.log('构建完成');
});
/*
gulp.task('default', ['build'], function() {
  console.log('构建完成');
});
*/
/*
gulp.task('requirejs', function() {
  rjs({
    name: 'main',
    baseUrl: './js/main.js',
    out: 'main-min.js',
    mainConfigFile: './js/main.js',
    shim: {}
  })
  .pipe(gulp.dest('./web1/js'));
});
*/