// ./nodejuice ~/git/kimbo.js/web/
module.exports = function (grunt) {

  grunt.initConfig({
    outputDir: 'www',

    stylus: {
      compile: {
        files: {
          '<%= outputDir %>/css/css.min.css': ['src/styl/*.styl']
        }
      }
    },

    cssmin: {
      compress: {
        files: {
          '<%= outputDir %>/css/css.min.css': ['src/styl/tuktuk.icon.css', '<%= outputDir %>/css/css.min.css']
        }
      }
    },

    jade: {
      compile: {
        files: [{
          expand: true,
          cwd: 'src/jade',
          src: '*.jade',
          ext: '.html',
          dest: '<%= outputDir %>'
        }]
      }
    },

    coffee: {
      compile: {
        files: {
          '<%= outputDir %>/js/scripts.js': ['src/coffee/*.coffee']
        }
      }
    },

    uglify: {
      target: {
        files: {
          '<%= outputDir %>/js/scripts.js': ['<%= outputDir %>/js/scripts.js']
        }
      }
    },

    watch: {
      stylus: {
        files: ['src/styl/*.styl'],
        tasks: ['stylus', 'cssmin']
      },

      jade: {
        files: ['src/jade/**/*.jade'],
        tasks: ['jade']
      },

      coffee: {
        files: ['src/coffee/*.coffee'],
        tasks: ['coffee', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['stylus', 'cssmin', 'jade', 'coffee', 'uglify']);

};
