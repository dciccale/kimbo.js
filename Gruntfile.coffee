module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

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
          ' * Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author %>\n' +
          ' * Released under the <%= pkg.licenses[0].type %> license\n' +
          ' * <%= pkg.licenses[0].url %>\n' +
          ' */\n'
        separator: '\n\n'

    jshint:
      files: ['Gruntfile.js', '<%= distPath %>.js']
      options:
        jshintrc: '.jshintrc'

    uglify:
      dest:
        files:
          '<%= distPath %>.min.js': ['<%= distPath %>.js']

      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> | <%= pkg.licenses[0].url %> */\n'
        sourceMap: '<%= distPath %>.sourcemap.js'

    watch:
      files: ['Gruntfile.js', 'src/*.js']
      tasks: ['default']

  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['concat', 'jshint', 'uglify']
