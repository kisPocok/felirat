var MovieHelper = require('./Helper');

module.exports = function ValidateMovie(Movie) {
    if (MovieHelper.isSubtitle(Movie.fileName) === true) {
        // TODO feliratot nem töltünk le újra :)
        throw new Error('Huh?');
    }

    if (MovieHelper.isDir(Movie.path) === true) {
        // TODO filename-et ellenőrízni, hogy mappa-e. Ha igen minden benne lévő fájlt csekkolni kell.
        throw new Error('Directory not supported yet!');
    }
    return Movie;
};
