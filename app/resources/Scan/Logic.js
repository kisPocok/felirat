'use strict';

var Q = require('q');
var fs = require('fs');
var minimatch = require("minimatch");

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

    /**
     * Collect Video files recursively in the given director
     *
     * Required parameters: path
     * Optional parameters: depth, fileFilter, directoryFilter
     *
     * @param {{path,depth,fileFilter,directoryFilter}} config
     * @returns {[File]}
     */
    this.collectFiles = function (config) {
        if (!config.path) {
            throw new Error('Path is required!');
        }

        // Control max depth
        if (config.depth < 1) {
            return [];
        }

        var self = this;
        var results = [];
        var list = fs.readdirSync(config.path);
        var callback = function (fileName) {
            var path = config.path + '/' + fileName;
            var stat = fs.statSync(path);
            if (stat && stat.isDirectory()) {
                if (checkFilter(config.directoryFilter, fileName)) {
                    results = results.concat(
                        self.collectFiles({
                            path: path,
                            depth: config.depth - 1,
                            fileFilter: config.fileFilter,
                            directoryFilter: config.directoryFilter
                        })
                    );
                }
            } else {
                if (checkFilter(config.fileFilter, fileName)) {
                    // add filtered files only
                    var item = new File(config.path, fileName, false);
                    results.push(item);
                }
            }
        };

        list.map(callback);
        return results;
    };

    /**
     * @param {string} filter
     * @param {string} fileName
     * @returns {boolean}
     */
    var checkFilter = function (filter, fileName) {
        return !(filter && minimatch(fileName, filter) === false);
    };

    /**
     * Get video files from a specified directory
     *
     * @param {string} path
     * @param {number} depth
     * @returns {[File]}
     */
    this.collectVideoFiles = function (path, depth) {
        var params = {
            path: path,
            depth: depth || 1,
            fileFilter: '*.+(' + MovieHelper.validVideoExtensions.join('|') + ')',
            directoryFilter: '!.*'
        };
        return this.collectFiles(params);
    };

    return this;
};
