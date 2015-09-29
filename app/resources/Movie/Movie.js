var movieTitle  = require('movie-title');
var MovieHelper = require('./Helper');

module.exports = function Movie(fileName, filePath) {
    this.fileName = fileName;
    this.fileNameWithoutExtension = MovieHelper.removeFileExtension(this.fileName);
    this.path = filePath ? filePath : null;


    this.title = movieTitle(this.fileName);
    this.season = null;
    this.episode = null;
    this.episodeName = null;
    this.releaseGroup = null;
    this.audio = null;
    this.codec = null;
    this.quality = null;
    this.resoultion = null;
    this.year = null;

    // On demand variables, use calculateFileSize() and calculateHash() to populate
    this.hash = null;
    this.sizeInBytes = null;

    this.calculateFileSize = function CalculateFileSize() {
        var stats = require('fs').statSync(this.path);
        this.sizeInBytes = stats.size;
        return this;
    };

    this.calculateHash = function CalculateHash() {
        var opensubtitles = require("opensubtitles-client");
        var self = this;
        return opensubtitles.hash.getHash(this.path)
            .then(function (hash) {
                self.hash = hash;
                return self;
            });
    };

    this.mergeWithLowPriority = function (InterpreterData) {
        this.title = this.title ? this.title : InterpreterData.title;
        this.title = this.title ? this.title : InterpreterData.title;
        this.season = null;
        this.episode = null;
        this.episodeName = null;
        this.releaseGroup = null;
        this.audio = null;
        this.codec = null;
        this.quality = null;
        this.resoultion = null;
        this.year = null;
    };

    return this;
};
