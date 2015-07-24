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
    return fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
};

MovieHelper.getFileExtension = function (fileName) {
    if (!fileName) {
        throw new Error('MISSING FILE!');
    }
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

MovieHelper.wrapperPassSourceAndOutputParams = function (movie, lang) {
    var OpenSubtitleClass = require('./OpenSubtitles');
    var subtitleApi = new OpenSubtitleClass();
    return function passSourceAndOutputParams(searchResponse) {
        var finalFileName = MovieHelper.removeFileExtension(movie.fileName);
        return {
            source: subtitleApi.getGzipUrl(searchResponse),
            destination: MovieHelper.baseDir(movie.path) + MovieHelper.srtFileName(finalFileName, lang)
        };
    };
};

module.exports = MovieHelper;