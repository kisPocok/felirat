var debug = true;

// Requirements
var Q = require('q');

/*
process.argv.slice(2).forEach(function (val, index, array) {
    // TODO
    console.log(index + ': ' + val);
});
*/

var createConnection = function Connect(SubtitleProvider) {
    var ConnectionError = function (error) {
        console.error('Connection Error:', error);
    };

    var AuthError = function (error) {
        console.error('Auth Error:', error.code);
    };

    var connectionPromise = Q.try(SubtitleProvider.connect())
        .catch(ConnectionError)
        .then(SubtitleProvider.logIn('CommanderSub', 'yY9oSnSYt9', 'OSTestUserAgent'))
        .catch(AuthError);

    return function getConnection() {
        return connectionPromise;
    };
};

var searchSubtitle = function SearchSub(api, apiConnection, SubtitleRequest) {
    var Movie = SubtitleRequest.for;
    var lang = SubtitleRequest.lang;

    // TODO ha fájlnévből nem megy mappa nevéből esetleg?

    var deferred = Q.defer();

    Q
        // Search by hash
        .try(apiConnection)
        .then(api.searchSubtitlesByHash(Movie.hash, Movie.sizeInBytes, lang))
        .then(deferred.resolve)

        // Search by title
        .catch(apiConnection)
        .then(api.searchSubtitles(Movie.title, Movie.season, Movie.episode, lang, 1))
        .then(deferred.resolve)

        // Search by file name
        .catch(apiConnection)
        .then(api.searchSubtitlesByFileName(Movie.fileName, lang))
        .then(deferred.resolve)

        // End it
        //.then(function Debug(r) { console.debug('debug in queue:', r); return r; })
        .catch(deferred.reject)
        .done(function () {
            // TODO drop the connection / logout
        });

    return deferred.promise;
};

module.exports = (function () {
    var SubtitleProvider = require('./Providers/OpenSubtitles');
    var api = new SubtitleProvider();
    var apiConnection = createConnection(api);
    searchSubtitle(api, apiConnection);
    console.log(apiConnection);
}());