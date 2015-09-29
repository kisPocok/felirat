var InterpreterData = require('../Data.js');

/**
 * @param Movie
 * @constructor
 */
var DefaultInterpreter = function DefaultInterpreter(Movie) {
    this.movie = Movie;
};

DefaultInterpreter.prototype.parse = function () {
    console.error('Not implemented "parse" func');
    return null;
};

DefaultInterpreter.prototype.populate = function () {
    console.error('Not implemented "populate" func');
    return null;
};

DefaultInterpreter.prototype.get = function () {
    return new InterpreterData(this.data.title, this.data.season, this.data.episode);
};

module.exports = DefaultInterpreter;