/*jshint latedef: nofunc */
'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var pkg = require('./package.json');
var dateformat = require('dateformat');
var rimraf = require('rimraf');
var karma = require('karma').server;
var karmaConfPath = path.join(__dirname, 'karma.conf.js');
var paths = require('./paths.conf')();
var shell = require('shelljs');

gulp.task('test', ['lint'], function (done) {
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
  return gulp.src([paths.src.all, paths.test.all, paths.gulpfile])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('coverage-report', ['test'], function (done) {
  shell.exec('rm -rf ' + paths.reports.coverage);
  shell.exec('mkdir ' + paths.reports.coverage);
  shell.exec('cp -r ' + paths.coverage + '**/* ' + paths.reports.coverage);
  done();
});

gulp.task('plato', function () {
  return gulp.src(paths.src.all)
    .pipe($.plato(paths.reports.plato, {
      jshint: JSON.parse(fs.readFileSync(paths.src.jshintrc))
    }));
});

gulp.task('reports', ['coverage-report', 'plato']);

gulp.task('clean', function (done) {
  rimraf(paths.dist, done);
});

gulp.task('committers', function () {
  $.gitCommitters({email: true})
    .pipe(gulp.dest('CONTRIBUTORS.txt'));
});

gulp.task('default', ['build']);

gulp.task('build', ['clean'], function () {
  var h = header();
  gulp.src(paths.src.files)
  .pipe($.concat(pkg.name + '.js'))
  .pipe($.header(h.long, h))
  .pipe(gulp.dest('dist'))
  .pipe($.sourcemaps.init())
  .pipe($.uglify())
  .pipe($.header(h.short, h))
  .pipe($.rename({extname: '.min.js'}))
  .pipe($.sourcemaps.write('../' + paths.dist))
  .pipe(gulp.dest(paths.dist));
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
