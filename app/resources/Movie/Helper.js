var fs = require('fs');

var MovieHelper = function MovieHelper() {
    this.subtitleExtension = 'srt';

    this.isDir = function (path) {
        return fs.lstatSync(path).isDirectory();
    };

    this.removeFileExtension = function (fileName) {
        return fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
    };

    this.getFileExtension = function (fileName) {
        if (!fileName) {
            throw new Error('MISSING FILE!');
        }
        return fileName.split('.').pop();
    };

    this.isSubtitle = function (fileName) {
        return this.getFileExtension(fileName) == this.subtitleExtension;
    };

    this.baseDir = function (path) {
        return path.substring(0, path.lastIndexOf("/")) + "/";
    };

    this.srtFileName = function (fileName, lang) {
        return fileName + '.' + lang + '.' + this.subtitleExtension;
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