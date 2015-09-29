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

var shortcut = function (action) {
    if (action !== 'merge' && action !== 'fill') {
        throw new Error('Missing implementation!');
    }
    var callbackName = action + 'Into';

    return function (provider, movie) {
        var data = provider(movie).parse().get();
        return data[callbackName](movie);
    };
};

var merge = shortcut('merge');
var fill  = shortcut('fill');

module.exports = (function MovieInterpreter(Movie) {
    var Movie = require('../Movie'); // TODO
    var movie = new Movie(
        'Fear.the.Walking.Dead.S01E04.Not.Fade.Away.720p.WEB-DL.DD5.1.H.264-NTb.mkv',
        '/User/vault/Movies/_seed/Fear.the.Walking.Dead.S01E04.720p.WEB-DL.DD5.1.H.264-NTb/Fear.the.Walking.Dead.S01E04.Not.Fade.Away.720p.WEB-DL.DD5.1.H.264-NTb.mkv'
    );

    var providers = getAllProviders();

    // populate movie
    merge(providers.MovieTitle, movie);
    fill(providers.ParseTorrentName, movie);
    fill(providers.SceneRelease, movie);

    console.log(movie);
    return movie;
}());
