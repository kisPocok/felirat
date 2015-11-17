var MovieHelper = require('../Movie/Helper');

module.exports = function File(path, fileName) {
    if (path.substr(path.length - 1) !== '/') {
        path += '/';
    }
    this.path = path + fileName;
    this.fileName = fileName;
    this.isDir = MovieHelper.isDir(this.path);

    return this;
};
