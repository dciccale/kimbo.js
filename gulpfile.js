'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var browserSync = require('browser-sync');
var min = false;

gulp.task('styles', function () {
  gulp.src('src/styl/css.styl')
    .pipe($.stylus())
    .pipe(min ? $.minifyCss() : $.util.noop)
    .pipe(gulp.dest('www/css'))
});

gulp.task('jade', function () {
  gulp.src('src/jade/*.jade')
    .pipe($.jade())
    .pipe(gulp.dest('www'))
});

gulp.task('scripts', function () {
  gulp.src('src/js/scripts.js')
    .pipe(min ? $.uglify() : $.util.noop)
    .pipe(gulp.dest('www/js'));
});

gulp.task('serve', ['styles', 'scripts'], function () {
  browserSync.init({
    server: {
      baseDir: 'www'
    },
    files: ['www/**']
  });

  gulp.watch('src/styl/*.styl', ['styles']);
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/js/*.js', ['scripts']);
});

gulp.task('dist', function () {
  min = true;
  gulp.start(['styles', 'scripts'], function () {
    min = false;
  });
});

gulp.task('serve-dist', ['dist'], function () {
  browserSync.init({
    server: {
      baseDir: 'www'
    }
  });
});

gulp.task('default', ['jade', 'styles', 'scripts']);
