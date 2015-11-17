'use strict';

var fs = require('fs');
//var path = require('path');

module.exports = (function TestTools() {
    var getRootDir = function () {
        return __dirname;
    };

    var createDirectoryIfNotExists = function (path, chmod) {
        try {
            fs.lstatSync(path);
        } catch (e) {
            fs.mkdirSync(path);
        }
        fs.chmodSync(path, chmod);
    };

    var createExampleDirectory = function (path) {
        return createDirectoryIfNotExists(path, '0777');
    };
    var createUnreadableDirectory = function (path) {
        return createDirectoryIfNotExists(path, '312');
    };
    var createUnwritableDirDirectory = function (path) {
        return createDirectoryIfNotExists(path, '556');
    };

    return {
        'getRootDir': getRootDir,
        'createExampleDirectory': createExampleDirectory,
        'createUnreadableDirectory': createUnreadableDirectory,
        'createUnwritableDirDirectory': createUnwritableDirDirectory
    };
})();
