var providers = require('./Config');

var registerProvider = function (providerClassName) {
    var provider = require('./Provider/' + providerClassName);
    return function (Movie) {
        return new provider(Movie);
    };
};

var getAllProviders = function () {
    var response = {};
    providers.map(function (provider) {
        response[provider] = registerProvider(provider);
    });
    return response;
};

/*
var getAllData = function (providers, movie) {
    Object.keys(providers).map(function (key) {
        var provider = providers[key];
        provider(movie).parse().get();
    });
};
*/

module.exports = (function MovieInterpreter(Movie) {
    var Movie = require('../Movie'); // TODO
    var movie = new Movie(
        'Fear.the.Walking.Dead.S01E04.Not.Fade.Away.720p.WEB-DL.DD5.1.H.264-NTb.mkv',
        '/User/vault/Movies/_seed/Fear.the.Walking.Dead.S01E04.720p.WEB-DL.DD5.1.H.264-NTb/Fear.the.Walking.Dead.S01E04.Not.Fade.Away.720p.WEB-DL.DD5.1.H.264-NTb.mkv'
    );

    var providers = getAllProviders();
    var data = providers.MovieTitle(movie).parse().get();
    var data2 = providers.ParseTorrentName(movie).parse().get();
    var data3 = providers.SceneRelease(movie).parse().get();
    movie.populate(data);
    movie.fill(data2);
    movie.fill(data3);

    console.log(movie);
}());
