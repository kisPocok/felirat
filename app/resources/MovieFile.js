var MovieFile = function MovieFile(fileName, path) {
    this.fileName = fileName;
    this.path = path;
    this.state = 'loading';
    this.htmlQuery = null;

    if (!this.fileName || !this.path) {
        throw new Error('Missing fileName or path from MovieFile!');
    }

    return this;
};

module.exports = MovieFile;