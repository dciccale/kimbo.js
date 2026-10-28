/*jshint latedef: nofunc */
'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var pkg = require('./package.json');
var dateformat = require('dateformat');
var rimraf = require('rimraf');
var KarmaServer = require('karma').Server;
var karmaConfPath = path.join(__dirname, 'karma.conf.js');
var paths = require('./paths.conf')();
var shell = require('shelljs');

gulp.task('lint', function () {
  return gulp.src([paths.src.all, paths.test.all, paths.gulpfile])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('test', gulp.series('lint', function (done) {
  new KarmaServer({
    configFile: karmaConfPath,
    singleRun: true
  }, done).start();
}));

gulp.task('test-ci', function (done) {
  new KarmaServer({
    configFile: karmaConfPath
  }, done).start();
});

gulp.task('coverage-report', gulp.series('test', function (done) {
  shell.exec('rm -rf ' + paths.reports.coverage);
  shell.exec('mkdir ' + paths.reports.coverage);
  shell.exec('cp -r ' + paths.coverage + '**/* ' + paths.reports.coverage);
  done();
}));

gulp.task('reports', gulp.series('coverage-report'));

gulp.task('clean', function (done) {
  rimraf(paths.dist, done);
});

gulp.task('build', gulp.series('clean', function () {
  var h = header();
  return gulp.src(paths.src.files, { sourcemaps: true })
  .pipe($.concat(pkg.name + '.js'))
  .pipe($.header(h.long, h))
  .pipe(gulp.dest('dist'))
  .pipe($.uglify())
  .pipe($.header(h.short, h))
  .pipe($.rename({extname: '.min.js'}))
  .pipe(gulp.dest(paths.dist, { sourcemaps: '.' }));
}));

gulp.task('default', gulp.series('build'));

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
