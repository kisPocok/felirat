var Subtitle = function Subtitle(Movie, language) {
    this.for = Movie;
    this.lang = language || 'eng';

    return this;
};

module.exports = Subtitle;