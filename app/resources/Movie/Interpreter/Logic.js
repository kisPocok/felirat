
var registerProvider = function (providerClassName) {
    var provider = require('./Provider/' + providerClassName);
    return function (Movie) {
        return new provider(Movie);
    };
};

var getAllProviders = function () {
    return {
        'MovieTitle': registerProvider('MovieTitle'),
        'SceneRelease': registerProvider('SceneRelease'),
        'ParseTorrentName': registerProvider('ParseTorrentName')
    };
};

module.exports = (function MovieInterpreter(Movie, Parser) {
    var Movie = {'name': 'Mr.Robot.S01E07.1080p.HDTV.x264-TASTETV'}; // TODO
    var providers = getAllProviders();
    console.log([
        providers.MovieTitle(Movie).parse().get(),
        providers.SceneRelease(Movie).parse().get(),
        providers.ParseTorrentName(Movie).parse().get(),
    ]);
}());
