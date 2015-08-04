module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      // fixtures
      'test/fixtures/*.html',

      // spec helper
      'test/spec.js',

      // tests
      'test/core.js',
      'test/query.js',
      'test/data.js',
      'test/css.js',
      'test/manipulation.js',
      'test/traversing.js',
      'test/utilities.js',
      'test/event.js',
      'test/ajax.js',

      // source
      'src/core.js',
      'src/query.js',
      'src/data.js',
      'src/css.js',
      'src/manipulation.js',
      'src/traversing.js',
      'src/utilities.js',
      'src/event.js',
      'src/ajax.js'
    ],
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
