var request = require('request');
var zlib    = require('zlib');
var fs      = require('fs');

module.exports = function SubtitleDownloader(params) {
    if (!params || !params.source || !params.destination) {
        throw new Error('Missing source or destination parameter!');
    }
    var output = fs.createWriteStream(params.destination);
    return request(params.source).pipe(zlib.createGunzip()).pipe(output);
};
