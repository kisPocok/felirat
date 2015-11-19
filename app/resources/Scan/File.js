var MovieHelper = require('../Movie/Helper');

module.exports = function File(path, fileName, isDir) {
    if (path.substr(path.length - 1) !== '/') {
        path += '/';
    }
    this.path = path + fileName;
    this.fileName = fileName;
    this.isDir = isDir === undefined ? MovieHelper.isDir(this.path) : isDir;
    this.isVideo = this.isDir ?  false : MovieHelper.isVideo(this.fileName);

    return this;
};
