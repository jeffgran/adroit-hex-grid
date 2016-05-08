var del = require('del');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-clean');

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
        clean: ["dist/*"]
    });

    //grunt.registerTask('clean');
    grunt.registerTask('default', ['clean', 'babel']);
};
