module.exports = function (grunt) {

  grunt.initConfig({
    pkg: '<json:package.json>',
    distPath: 'dist/<%= pkg.name %>',
    meta: {
      banner: '/*!\n' +
        ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Released under the <%= pkg.licenses[0].type %> license\n' +
        ' * <%= pkg.licenses[0].url %>\n' +
        ' */',
      bannerMin: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> | <%= pkg.licenses[0].url %> */'
    },
    concat: {
      dist: {
        src: [
          '<banner>',
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
        ],
        separator: '\n\n',
        dest: '<%= distPath %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.bannerMin>', '<%= distPath %>.js'],
        dest: '<%= distPath %>.min.js'
      }
    },
    lint: {
      files: ['grunt.js', '<config:concat.dist.dest>']
    },
    jshint: grunt.file.readJSON('.jshintrc'),
    watch: {
      files: ['src/*.js'],
      tasks: 'default'
    }
  });

  grunt.registerTask('default', 'concat lint min');

};
