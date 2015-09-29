var inherits = require('util').inherits;
var providerClass = require('movie-title');
var InterpreterData = require('../Data.js');
var DefaultInterpreter = require('./Default');

function MovieTitle(Movie) {
    DefaultInterpreter.call(this, Movie);
}

inherits(MovieTitle, DefaultInterpreter);

MovieTitle.prototype.parse = function () {
    this.data = providerClass(this.movie.fileName);
    return this;
};

MovieTitle.prototype.get = function () {
    return new InterpreterData(this.data);
};

module.exports = MovieTitle;