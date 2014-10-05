module.exports = ->

  require('load-grunt-tasks')(@)

  @initConfig
    SRC_DIR: 'src/'
    DIST_FILE: 'dist/<%= PKG.name %>'
    WEB_DIR: 'www/'
    PKG: @file.readJSON 'package.json'

    concat:
      dist:
        src: [
          '<%= SRC_DIR %>core.js',
          '<%= SRC_DIR %>query.js',
          '<%= SRC_DIR %>data.js',
          '<%= SRC_DIR %>css.js',
          '<%= SRC_DIR %>manipulation.js',
          '<%= SRC_DIR %>traversing.js',
          '<%= SRC_DIR %>utilities.js',
          '<%= SRC_DIR %>event.js',
          '<%= SRC_DIR %>ajax.js'
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

    uglify:
      dist:
        files:
          '<%= DIST_FILE %>.min.js': ['<%= DIST_FILE %>.js']

      options:
        banner: '/*! <%= PKG.name %> v<%= PKG.version %> | <%= PKG.homepage %> | <%= PKG.licenses[0].url %> */\n'
        sourceMap: '<%= DIST_FILE %>.sourcemap.js'

    watch:
      dev:
        files: ['<%= SRC_DIR %>*.js']
        tasks: ['concat']

      src:
        files: ['<%= SRC_DIR %>*.js']
        tasks: ['concat']

    committers:
      options:
        email: true
        output: 'CONTRIBUTORS.txt'

    plato:
      src:
        options:
          jshint: @file.readJSON 'src/.jshintrc'
        files:
          '<%= WEB_DIR %>reports': ['<%= SRC_DIR %>*.js']

  @registerTask 'build', ['concat', 'uglify']
  @registerTask 'default', ['build', 'committers', 'plato']
