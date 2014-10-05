module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/fixtures/*.html',
      {pattern: 'test/*.js', include: false},
      {pattern: 'dist/kimbo.js', include: false}
    ],
    preprocessors: {
      'dist/kimbo.js': ['coverage'],
      'test/fixtures/*.html': ['html2js']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'}
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
