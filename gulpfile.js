/*jshint latedef: nofunc */
'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var pkg = require('./package.json');
var dateformat = require('dateformat');
var rimraf = require('rimraf');
var karma = require('karma').server;
var karmaConfPath = path.join(__dirname, 'karma.conf.js');

gulp.task('test', function (done) {
  karma.start({
    configFile: karmaConfPath,
    singleRun: true
  }, done);
});

gulp.task('test-ci', function (done) {
  karma.start({
    configFile: karmaConfPath
  }, done);
});

gulp.task('lint', function () {
  gulp.src(['src/*.js', 'test/*.js', 'gulpfile.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function (done) {
  rimraf('dist', done);
});

gulp.task('committers', function () {
  $.gitCommitters({email: true})
    .pipe(gulp.dest('CONTRIBUTORS.txt'));
});

gulp.task('default', ['test', 'build']);

gulp.task('build', ['clean'], function () {
  var h = header();
  gulp.src([
    'src/core.js',
    'src/query.js',
    'src/data.js',
    'src/css.js',
    'src/manipulation.js',
    'src/traversing.js',
    'src/utilities.js',
    'src/event.js',
    'src/ajax.js'
  ])
  .pipe($.concat('kimbo.js'))
  .pipe($.header(h.long, h))
  .pipe(gulp.dest('dist'))
  .pipe($.sourcemaps.init())
  .pipe($.uglify())
  .pipe($.header(h.short, h))
  .pipe($.rename({extname: '.min.js'}))
  .pipe($.sourcemaps.write('../dist'))
  .pipe(gulp.dest('dist'));
});

function header() {
  var date = new Date();
  pkg.date = dateformat(date, 'yyyy-MM-dd');
  pkg.year = date.getFullYear();

  var long = [
    '/*!',
    '* <%= pkg.name %> v<%= pkg.version %> - <%= pkg.date %>',
    '* <%= pkg.homepage %>',
    '* Copyright (c) <%= pkg.year %> <%= pkg.author %>',
    '* Released under the <%= pkg.licenses[0].type %> license',
    '* <%= pkg.licenses[0].url %>',
    '*/',
    ''
  ].join('\n');

  var short = [
    '/*! <%= pkg.name %> v<%= pkg.version %>',
    '<%= pkg.homepage %>',
    '<%= pkg.licenses[0].url %> */\n'
  ].join(' | ');

  return {
    long: long,
    short: short,
    pkg: pkg
  };
}
