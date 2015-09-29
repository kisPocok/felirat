var inherits = require('util').inherits;
var providerClass = require('parse-torrent-name');
var InterpreterData = require('../Data.js');
var DefaultInterpreter = require('./Default');

function ParseTorrentName(Movie) {
    DefaultInterpreter.call(this, Movie);
}

inherits(ParseTorrentName, DefaultInterpreter);

ParseTorrentName.prototype.parse = function () {
    //ParseTorrentName.super_.prototype.parse.apply(this);
    this.data = providerClass(this.movie.fileName);
    return this;
};

ParseTorrentName.prototype.get = function () {
    return new InterpreterData(
        this.data.title,
        this.data.episode,
        this.data.season,
        this.data.audio,
        this.data.codec,
        this.data.quality,
        this.data.resolution,
        this.data.year,
        this.data.episodeName,
        this.data.group
    );
};

module.exports = ParseTorrentName;
