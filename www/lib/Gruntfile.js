module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        predef: [ "document", "console", "$", "firebase", "$localStorage", "navigator", "window", "cordova", "StatusBar" ],
        esnext: true,
        globalstrict: true,
        globals: {"angular": true, "app": true},
        ignores: ["../app/angular-spotify.min.js"]
      },
      files: ['../app/**/*.js']
    },
    sass: {
      dist: {
        files: {
          '../css/styles.css' : '../sass/styles.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['../app/**/*.js'],
        tasks: ['jshint']
      },
      sass: {
        files: ['../sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint','sass', 'watch']);
};

