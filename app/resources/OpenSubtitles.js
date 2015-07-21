var Q      = require('q');
var xmlrpc = require('xmlrpc');

var OpenSubtitles = function () {
    this.activeConnection = null;
    this.token = null;
    this.host = 'api.opensubtitles.org';
    this.path = '/xml-rpc';
    this.port = 80;
};

OpenSubtitles.prototype.connect = function (host, path, port) {
    var self = this;
    var connectParams = {
        host: host || this.host,
        path: path || this.path,
        port: port || this.port
    };
    return function () {
        self.activeConnection = xmlrpc.createClient(connectParams);
        return self;
    };
};

OpenSubtitles.prototype.logIn = function (username, password, userAgent) {
    var params = [username, password, 'eng', userAgent];

    return function (self) {
        if (!self.activeConnection) {
            throw 'No connection!';
        }

        var deferred = Q.defer();
        self.activeConnection.methodCall('LogIn', params, function (error, response) {
            if (error) {
                //console.log('Login error');
                //console.log('Login error', error);
                deferred.reject(error);
            } else {
                //console.log('Login responsed');
                //console.log('Login response', response);
                self.token = response.token;
                deferred.resolve(self);
            }
        });
        return deferred.promise;
    };
};

/**
 * This is the base search method. Do not call it directly!
 *
 * @param searchParams
 * @returns {Function}
 */
var OpenSubtitlesSearchByParams = function SearchSubtitles(searchParams, limit) {
    return function ExecuteSearchSubtitles(self) {
        if (!self.activeConnection) {
            throw new Error('No connection!');
        }
        if (!self.token) {
            throw new Error('Missing token!');
        }

        var params = [
            self.token,
            searchParams,
            {
                limit: limit || 1
            }
        ];

        var deferred = Q.defer();
        self.activeConnection.methodCall('SearchSubtitles', params, function (error, response) {
            console.debug('search response', response);
            if (response.data === false) {
                return deferred.reject(new Error('No subtitle found!'));
            }

            if (error) {
                return deferred.reject(error);
            }

            return deferred.resolve(response);
        });
        return deferred.promise;
    };
}

OpenSubtitles.prototype.searchSubtitlesByHash = function SearchByHashAndSize(hash, size, lang) {
    var movieParams = [{
        moviehash:     hash, // movie's hash
        moviebytesize: size, // size in bites
        sublanguageid: lang || 'eng'
    }];
    return OpenSubtitlesSearchByParams(movieParams);
}

OpenSubtitles.prototype.searchSubtitlesByFileName = function SearchByFileName(fileName, lang) {
    var movieParams = [{
        tag: fileName,
        sublanguageid: lang || 'eng'
    }];
    return OpenSubtitlesSearchByParams(movieParams);
};

OpenSubtitles.prototype.searchSubtitles = function (movieTitle, season, episode, lang, limit) {
    var movieParams = [{
        query: movieTitle,
        sublanguageid: lang || 'eng'
    }];
    if (season) { movieParams.season = parseInt(season); }
    if (episode) { movieParams.episode = parseInt(episode); }

    return OpenSubtitlesSearchByParams(movieParams, limit);
};

OpenSubtitles.prototype.getGzipUrl = function (searchResponse) {
    if (!searchResponse || !searchResponse.data || !searchResponse.data[0]) {
    throw new Error('Missing SubDownloadLink param');
    }
    return searchResponse.data[0].SubDownloadLink;
};

module.exports = OpenSubtitles;
