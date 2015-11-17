var Q = require('q');
var fs = require('fs');
var MovieHelper = require('../Movie/Helper');

module.exports = function ScanLogic() {
    this.readDirectory = function (path) {
        var deferred = Q.defer();

        if (!path) {
            deferred.reject('Missing path!');
        }

        try {
            if (MovieHelper.isDir(path)) {
                // deferred.makeNodeResolver()
                fs.readdir(path, function (error, files) {
                    if (error) {
                        deferred.reject(new Error(error));
                    } else {
                        deferred.resolve(files);
                    }
                });
            }
        } catch (e) {
            deferred.reject(new Error('Wrong path!'));
        }

        return deferred.promise;
    };
    return this;
};
