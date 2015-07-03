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

OpenSubtitles.prototype.searchSubtitles = function (movieTitle, season, episode, lang, limit) {
    var movieParams = {
        query: movieTitle,
        sublanguageid: lang || 'eng'
    };
    if (season) { movieParams.season = season; }
    if (episode) { movieParams.episode = episode; }

    return function ExecuteSearchSubtitles(self) {
        if (!self.activeConnection) {
            throw 'No connection!';
        }
        if (!self.token) {
            throw 'Missing token!';
        }

        var params = [
            self.token,
            [movieParams],
            {
                limit: limit || 1
            }
        ];

        var deferred = Q.defer();
        self.activeConnection.methodCall('SearchSubtitles', params, function (error, response) {
            if (error) {
                //console.log('SearchSubtitles error', error);
                deferred.reject(error);
            } else {
                //console.log('SearchSubtitles response', response);
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

};

module.exports = OpenSubtitles;
