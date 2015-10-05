/**
 * @param DefaultSearchProvider
 * @constructor
 */
var DefaultSearchProvider = function DefaultSearchProvider() {
    return this;
};

DefaultSearchProvider.prototype.connect = function () {
    console.error('Not implemented "connect" func');
    return null;
};

DefaultSearchProvider.prototype.logIn = function (username, password) {
    console.error('Not implemented "logIn" func');
    return null;
};

DefaultSearchProvider.prototype.searchSubtitlesByHash = function (hash, size, lang) {
    throw new Error('Not implemented!');
};

DefaultSearchProvider.prototype.searchSubtitlesByFileName = function (fileName, lang) {
    throw new Error('Not implemented!');
};

DefaultSearchProvider.prototype.searchSubtitles = function (movieTitle, season, episode, lang, limit) {
    throw new Error('Not implemented!');
};

DefaultSearchProvider.prototype.getGzipUrl = function (searchResponse) {
    throw new Error('Not implemented!');
};

module.exports = DefaultSearchProvider;