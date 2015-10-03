var fs = require('fs');

var MovieHelper = function MovieHelper() {
    this.validSubtitleExtension = 'srt';

    this.isDir = function (path) {
        this.isReadable(path);
        return fs.lstatSync(path).isDirectory();
    };

    this.isWritable = function (path) {
        fs.accessSync(path, fs.W_OK);
    };

    this.isReadable = function (path) {
        fs.accessSync(path, fs.R_OK);
    };

    this.removeFileExtension = function (fileName) {
        return fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
    };

    this.getFileExtension = function (fileName) {
        if (!fileName) {
            throw new Error('Missing fileName!');
        }
        return fileName.split('.').pop();
    };

    this.isSubtitle = function (fileName) {
        return this.getFileExtension(fileName) === this.validSubtitleExtension;
    };

    this.baseDir = function (path) {
        return path.substring(0, path.lastIndexOf("/")) + "/";
    };

    this.srtFileName = function (fileName, lang) {
        return fileName + '.' + lang + '.' + this.validSubtitleExtension;
    };

    this.wrapperPassSourceAndOutputParams = function (movie, lang) {
        var OpenSubtitleClass = require('./OpenSubtitles');
        var subtitleApi = new OpenSubtitleClass();
        var self = this;
        return function passSourceAndOutputParams(searchResponse) {
            var finalFileName = self.removeFileExtension(movie.fileName);
            return {
                source: subtitleApi.getGzipUrl(searchResponse),
                destination: self.baseDir(movie.path) + self.srtFileName(finalFileName, lang)
            };
        };
    };

    return this;
};

module.exports = new MovieHelper();