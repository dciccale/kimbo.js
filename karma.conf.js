module.exports = function (config) {
  var paths = require('./paths.conf')();

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [].concat(paths.test.fixtures, paths.test.helper, paths.src.files, 'test/fixture.js', paths.test.files),
    preprocessors: {
      'src/*.js': ['coverage'],
      'test/fixtures/*.html': ['html2js']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: paths.coverage,
      reporters: [
        {type: 'html'},
        {type: 'lcovonly', subdir: '.', file: 'lcov.info'}
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
