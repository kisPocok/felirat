
module.exports = function InterpreterData(
    title, season, episode, audio, codec, quality, resolution, year, releaseGroup, episodeName
) {
    // Basic parameters
    this.title   = title   || null;
    this.season  = season  || null;
    this.episode = episode || null;

    // Additional parameters
    this.episodeName  = episodeName  || null;
    this.releaseGroup = releaseGroup || null;
    this.audio        = audio        || null;
    this.codec        = codec        || null;
    this.quality      = quality      || null;
    this.resoultion   = resolution   || null;
    this.year         = year         || null;

    this.getNonEmptyFields = function () {
        var self = this;
        return Object.keys(this).filter(function (key) {
            return self[key] !== null && typeof self[key] !== 'function';
        });
    };

    this.getFields = function () {
        var self = this;
        return Object.keys(this).filter(function (key) {
            return typeof self[key] !== 'function';
        });
    };
};