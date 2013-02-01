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

    mincss: {
      dist: {
        src: ['src/styl/tuktuk.icon.css', '<%= outputDir %>/css/css.min.css'],
        dest: '<%= outputDir %>/css/css.min.css'
      }
    },

    jade: {
      html: {
        src: ['src/jade/*.jade'],
        dest: '<%= outputDir %>',
        options: {
          client: false
        }
      }
    },

    coffee: {
      compile: {
        files: {
          '<%= outputDir %>/js/scripts.js': 'src/coffee/*.coffee'
        }
      }
    },

    min: {
      dist: {
        src: ['<%= outputDir %>/js/scripts.js'],
        dest: '<%= outputDir %>/js/scripts.js'
      }
    },

    watch: {
      stylus: {
        files: ['src/styl/*.styl'],
        tasks: 'stylus mincss'
      },
      jade: {
        files: ['src/jade/**/*.jade'],
        tasks: 'jade'
      },
      coffee: {
        files: ['src/coffee/*.coffee'],
        tasks: 'coffee min'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-mincss');

  grunt.registerTask('default', 'stylus mincss jade coffee min');

};
