module.exports = function (config) {
  var paths = require('./paths.conf')();

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [].concat(paths.test.fixtures, paths.test.helper, paths.test.files, paths.src.files),
    preprocessors: {
      'src/*.js': ['coverage'],
      'test/fixtures/*.html': ['html2js']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
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
