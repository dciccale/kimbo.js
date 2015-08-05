'use strict';

module.exports = function () {
  var srcdir = 'src/';
  var testdir = 'test/';
  var fixturesdir = testdir + 'fixtures/';

  var files = [
    'core.js',
    'query.js',
    'data.js',
    'css.js',
    'manipulation.js',
    'traversing.js',
    'utilities.js',
    'event.js',
    'ajax.js'
  ];

  var src = files.map(function (file) {
    return srcdir + file;
  });

  var test = files.map(function (file) {
    return testdir + file;
  });

  var paths = {
    test: {
      files: test,
      all: testdir + '*.js',
      helper: testdir + 'spec.js',
      fixtures: fixturesdir + '*.html'
    },
    src: {
      files: src,
      all: srcdir + '*.js',
      jshintrc: srcdir + '.jshintrc'
    },
    dist: 'dist/',
    gulpfile: 'gulpfile.js',
    plato: 'www/reports/'
  };

  return paths;
};
