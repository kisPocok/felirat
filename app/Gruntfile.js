module.exports = function(grunt) {
    var pkg = require('./package.json');
    var dependencies = Object.keys(pkg.dependencies);
    var nodeModules = dependencies.map(function(resource) {
        return './node_modules/' + resource + '/**/*';
    });

    var assets = [
        './index.html',
        './package.json',
        './assets/**/*',
        './css/**/*',
        './font/**/*',
        './images/**/*',
        './material-design-lite/**/*',
        './node_modules/material-design-icons/iconfont/**/*',
        './resources/**/*'
    ];

    var buildFiles = assets.concat(nodeModules);

    grunt.initConfig({
        nwjs: {
            options: {
                platforms: ['osx64'],
                buildDir: './build'
                //version: '0.10.0',
                //credits: './public/Credits.html',
                //macIcns: './icon.icns', // Path to the Mac icon file
            },
            src: buildFiles
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.registerTask('default', ['nwjs']);
};