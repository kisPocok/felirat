var inherits = require('util').inherits;
var providerClass = require('scene-release');
var InterpreterData = require('../Data.js');
var DefaultInterpreter = require('./Default');

function SceneRelease(Movie) {
    DefaultInterpreter.call(this, Movie);
}

inherits(SceneRelease, DefaultInterpreter);

SceneRelease.prototype.parse = function () {
    //SceneRelease.super_.prototype.parse.apply(this);
    this.data = providerClass(this.movie.name);
    return this;
};

SceneRelease.prototype.get = function () {
    return new InterpreterData(
        this.data.title,
        this.data.episode,
        this.data.season,
        this.data.audio,
        this.data.video,
        this.data.type,
        this.data.resolution,
        this.data.year,
        null,
        this.data.group
    );
};

module.exports = SceneRelease;
