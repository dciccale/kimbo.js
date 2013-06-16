module.exports = ->

  @initConfig
    OUTPUT_DIR: 'www'

    stylus:
      compile:
        files:
          '<%= OUTPUT_DIR %>/css/css.min.css': ['src/styl/*.styl']

    cssmin:
      compress:
        files:
          '<%= OUTPUT_DIR %>/css/css.min.css': ['src/styl/tuktuk.icon.css', '<%= OUTPUT_DIR %>/css/css.min.css']

    jade:
      compile:
        files: [
          expand: true
          cwd: 'src/jade'
          src: '*.jade'
          ext: '.html'
          dest: '<%= OUTPUT_DIR %>'
        ]

    coffee:
      compile:
        files:
          '<%= OUTPUT_DIR %>/js/scripts.js': ['src/coffee/*.coffee']

    uglify:
      target:
        files:
          '<%= OUTPUT_DIR %>/js/scripts.js': ['<%= OUTPUT_DIR %>/js/scripts.js']

    watch:
      stylus:
        files: ['src/styl/*.styl']
        tasks: ['stylus', 'cssmin']

      jade:
        files: ['src/jade/**/*.jade']
        tasks: ['jade']

      coffee:
        files: ['src/coffee/*.coffee']
        tasks: ['coffee', 'uglify']

  @loadNpmTasks 'grunt-contrib-stylus'
  @loadNpmTasks 'grunt-contrib-cssmin'
  @loadNpmTasks 'grunt-contrib-jade'
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-watch'

  @registerTask 'default', ['stylus', 'cssmin', 'jade', 'coffee', 'uglify']
