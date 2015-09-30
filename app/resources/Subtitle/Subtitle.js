module.exports = function Subtitle(Movie, language) {
    this.for = Movie;
    this.lang = language || 'eng';

    return this;
};
