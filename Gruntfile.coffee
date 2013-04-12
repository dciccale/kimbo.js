module.exports = ->

  @initConfig
    pkg: @file.readJSON('package.json')

    distPath: 'dist/<%= pkg.name %>'

    concat:
      dist:
        src: [
          'src/intro.js',
          'src/core.js',
          'src/query.js',
          'src/manipulation.js',
          'src/traversing.js',
          'src/utilities.js',
          'src/events.js',
          'src/ajax.js',
          'src/exports.js',
          'src/outro.js'
        ]
        dest: '<%= distPath %>.js'

      options:
        banner: '/*!\n' +
          ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
          ' * Released under the <%= pkg.licenses[0].type %> license\n' +
          ' * <%= pkg.licenses[0].url %>\n' +
          ' */\n'
        separator: '\n\n'

    jshint:
      files: ['Gruntfile.js', '<%= distPath %>.js']
      options:
        jshintrc: ['.jshintrc']

    coffee:
      compile:
        expand: true
        cwd: 'test/spec'
        src: ['*.coffee']
        dest: 'test/spec/'
        ext: '.js'

    jasmine:
      test:
        src: ['<%= distPath %>.js']
        options:
          specs: ['test/spec/*Spec.js']
          template: __dirname + '/test/SpecRunner.tmpl'

    uglify:
      dest:
        files:
          '<%= distPath %>.min.js': ['<%= distPath %>.js']

      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> | <%= pkg.licenses[0].url %> */\n'
        sourceMap: '<%= distPath %>.sourcemap.js'
        report: 'gzip'

    watch:
      gruntfile:
        files: ['Gruntfile.coffee']
        tasks: ['jshint']

      lib:
        files: ['src/*.js']
        tasks: ['default']

      test:
        files: ['test/spec/*.coffee']
        tasks: ['coffee', 'jasmine']

  @loadNpmTasks 'grunt-contrib-concat'
  @loadNpmTasks 'grunt-contrib-jshint'
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-contrib-jasmine'
  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-watch'

  @registerTask 'default', ['concat', 'jshint', 'coffee', 'jasmine', 'uglify']
