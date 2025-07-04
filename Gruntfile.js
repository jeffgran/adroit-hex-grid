module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          "expand": true,
          "cwd": "src/",
          "src": ["**/*.js"],
          "dest": "dist/",
          "ext": ".js"
        }]
      }
    },
    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: ['babel'],
        options: {
          interrupt: true
        }
      }
    },
    clean: ["dist/*"]
  });

  grunt.registerTask('default', ['clean', 'babel']);
};
