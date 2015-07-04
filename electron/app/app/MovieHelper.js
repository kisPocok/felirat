
var request = require('request');
var zlib    = require('zlib');
var fs      = require('fs');

var MovieHelper = {
    subtitleExtension: 'srt'
};

MovieHelper.isDir = function (path) {
    return fs.lstatSync(path).isDirectory();
};

MovieHelper.removeFileExtension = function (fileName) {
    return fileName.replace(/\.[^/.]+$/, "");
};

MovieHelper.getFileExtension = function (fileName) {
    return fileName.split('.').pop();
};

MovieHelper.isSubtitle = function (fileName) {
    return MovieHelper.getFileExtension(fileName) == MovieHelper.subtitleExtension;
};

MovieHelper.baseDir = function (path) {
    return path.substring(0, path.lastIndexOf("/")) + "/";
};

MovieHelper.srtFileName = function (fileName, lang) {
    return fileName + '.' + lang + '.' + MovieHelper.subtitleExtension;
};

module.exports = MovieHelper;
