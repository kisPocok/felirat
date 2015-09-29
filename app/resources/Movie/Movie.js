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

    var updateOnNonExist = function (InterpreterData) {
        var self = this;
        return function (field) {
            if (self[field] === null) {
                self[field] = InterpreterData[field];
            }
        };
    };

    /**
     * Update every field
     * @param InterpreterData
     */
    this.populate = function (InterpreterData) {
        var fill = updateOnNonExist.call(this, InterpreterData);
        InterpreterData.getFields().map(fill);
    };

    /**
     * Update fields which are empty (null)
     * @param InterpreterData
     */
    this.fill = function (InterpreterData) {
        var fill = updateOnNonExist.call(this, InterpreterData);
        InterpreterData.getNonEmptyFields().map(fill);
    };

    return this;
};
