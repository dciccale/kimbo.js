// ./nodejuice ~/git/kimbo.js/web/
module.exports = function (grunt) {

  grunt.initConfig({
    stylus: {
      compile: {
        files: {
          'css/css.css': ['src/styl/*.styl']
        }
      }
    },
    mincss: {
      dist: {
        src: ['css/css.css'],
        dest: 'css/css.css'
      }
    },
    jade: {
      html: {
        src: ['src/jade/*.jade'],
        dest: './',
        options: {
          client: false
        }
      }
    },
    coffee: {
      compile: {
        files: {
          'js/scripts.js': 'src/coffee/*.coffee'
        }
      }
    },
    min: {
      dist: {
        src: ['js/scripts.js'],
        dest: 'js/scripts.js'
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
