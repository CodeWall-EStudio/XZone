var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var rjs = require('gulp-requirejs');


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