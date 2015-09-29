var request = require('request');
var zlib    = require('zlib');
var fs      = require('fs');

module.exports = function DownloadLogic(SubtitleRequest) {
    if (!SubtitleRequest || SubtitleRequest.validate()) {
        throw new Error('Missing source or destination parameter!');
    }
    var output = fs.createWriteStream(SubtitleRequest.destination);
    var result = request(SubtitleRequest.source)
        .pipe(zlib.createGunzip())
        .pipe(output);

    return {
        writable: result.writable,
        path:     result.path,
        mode:     result.mode,
        flags:    result.flags
    };
};
