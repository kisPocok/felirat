module.exports = function(grunt) {
    grunt.initConfig({
        nwjs: {
            options: {
                platforms: ['osx64'],
                buildDir: './build'
                //version: '0.10.0',
                //credits: './public/Credits.html',
                //macIcns: './icon.icns', // Path to the Mac icon file
            },
            src: [
                './*',
                './**/*'
                /*
                './app/css/*',
                './app/font/*',
                './app/images/*',
                './app/material-design-lite/*',
                './app/node_modules/*',
                './app/resources/*'
                */
            ]
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.registerTask('default', ['nwjs']);
};