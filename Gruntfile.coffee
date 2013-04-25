module.exports = ->

  @initConfig
    SRC_DIR: 'src/'
    TESTS_DIR: 'test/'
    SPEC_DIR: '<%= TESTS_DIR %>spec/'
    DIST_FILE: 'dist/<%= PKG.name %>'
    PKG: @file.readJSON('package.json')

    concat:
      dist:
        src: [
          '<%= SRC_DIR %>intro.js',
          '<%= SRC_DIR %>core.js',
          '<%= SRC_DIR %>query.js',
          '<%= SRC_DIR %>manipulation.js',
          '<%= SRC_DIR %>traversing.js',
          '<%= SRC_DIR %>utilities.js',
          '<%= SRC_DIR %>events.js',
          '<%= SRC_DIR %>ajax.js',
          '<%= SRC_DIR %>exports.js',
          '<%= SRC_DIR %>outro.js'
        ]
        dest: '<%= DIST_FILE %>.js'

      options:
        banner: '/*!\n' +
          ' * <%= PKG.name %> v<%= PKG.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * <%= PKG.homepage %>\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= PKG.author %>\n' +
          ' * Released under the <%= PKG.licenses[0].type %> license\n' +
          ' * <%= PKG.licenses[0].url %>\n' +
          ' */\n'
        separator: '\n\n'

    jshint:
      gruntfile:
        src: ['Gruntfile.js']
        options:
          jshintrc: '.jshintrc'

      lib:
        src: ['<%= DIST_FILE %>.js']
        options:
          jshintrc: '<%= SRC_DIR %>.jshintrc'

      tests:
        src: ['<%= TESTS_DIR %><%= SPEC_DIR %>/*.js']
        options:
          jshintrc: '<%= TESTS_DIR %>/.jshintrc'

    coffee:
      compile:
        expand: true
        cwd: '<%= TESTS_DIR %><%= SPEC_DIR %>'
        src: ['*.coffee']
        dest: '<%= TESTS_DIR %><%= SPEC_DIR %>/'
        ext: '.js'

    jasmine:
      test:
        src: ['<%= DIST_FILE %>.js']
        options:
          specs: ['<%= SPEC_DIR %>/*Spec.js']
          template: '<%= TESTS_DIR %>SpecRunner.tmpl'

    uglify:
      dest:
        files:
          '<%= DIST_FILE %>.min.js': ['<%= DIST_FILE %>.js']

      options:
        banner: '/*! <%= PKG.name %> v<%= PKG.version %> | <%= PKG.homepage %> | <%= PKG.licenses[0].url %> */\n'
        sourceMap: '<%= DIST_FILE %>.sourcemap.js'

    watch:
      gruntfile:
        files: ['Gruntfile.coffee']
        tasks: ['jshint:gruntfile']

      lib:
        files: ['<%= SRC_DIR %>*.js']
        tasks: ['build', 'jshint:lib', 'test']

      test:
        files: ['<%= TESTS_DIR %><%= SPEC_DIR %>/*.coffee']
        tasks: ['test', 'jshint:tests']

  @loadNpmTasks 'grunt-contrib-concat'
  @loadNpmTasks 'grunt-contrib-jshint'
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-contrib-jasmine'
  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-watch'

  @registerTask 'build', ['concat', 'uglify']
  @registerTask 'test', ['build', 'coffee', 'jasmine']
  @registerTask 'default', ['build', 'jshint', 'test']
