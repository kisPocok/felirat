'use strict';

var Q = require('q');
var fs = require('fs');

var MovieHelper = require('../Movie/Helper');
var File = require('./File');

module.exports = function ScanLogic() {

    /**
     * Read files in a single directory
     *
     * @param {string} path
     * @returns {promise}
     */
    this.readDirectory = function (path) {
        var self = this;
        var deferred = Q.defer();

        if (!path) {
            deferred.reject('Missing path!');
        }

        try {
            if (MovieHelper.isDir(path)) {
                fs.readdir(path, function (error, files) {
                    if (error) {
                        deferred.reject(new Error(error));
                    } else {
                        var fileList = self.createFileList(path, files);
                        deferred.resolve(fileList);
                    }
                });
            }
        } catch (e) {
            deferred.reject(new Error('Wrong path!'));
        }

        return deferred.promise;
    };

    /**
     * Create list using path and file list
     *
     * @param {string} path
     * @param {[string]} files
     * @returns [File]
     */
    this.createFileList = function (path, files) {
        return files.map(function (fileName) {
            return new File(path, fileName);
        });
    };

    /**
     * Filter our every non directory
     *
     * @param {[File]} fileList
     * @returns [File]
     */
    this.filterOutFiles = function (fileList) {
        return fileList.filter(function (File) {
            return File.isDir;
        });
    };

    /**
     * Filter our every directory
     *
     * @param {[File]} fileList
     * @returns [File]
     */
    this.filterOutFolders = function (fileList) {
        return fileList.filter(function (File) {
            return !File.isDir;
        });
    };

    return this;
};
