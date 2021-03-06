var movieTitle       = require('movie-title');
var sceneRelease     = require('scene-release');
var parseTorrentName = require('parse-torrent-name');
var MovieHelper      = require('./MovieHelper');

var Movie = function Movie(fileName, filePath, lang) {
    this.fileName = fileName;
    this.fileNameWithoutExtension = MovieHelper.removeFileExtension(this.fileName);
    this.path = filePath ? filePath : null;

    this.subtitleLang = lang || 'eng';

    this.title = movieTitle(this.fileName);
    this.season = null;
    this.episode = null;
    this.episodeName = null;
    this.releaseGroup = null;
    this.audio = null;
    this.codec = null;
    this.quality = null;
    this.resoultion = null;
    this.year = null;


    this.hash = null;
    this.sizeInBytes = null;

    this.calculateFileSize = function CalculateFileSize() {
        var stats = require('fs').statSync(this.path);
        this.sizeInBytes = stats["size"];
        return this;
    }

    this.calculateHash = function CalculateHash() {
        var opensubtitles = require("opensubtitles-client");
        var self = this;
        return opensubtitles.hash.getHash(this.path)
            .then(function (hash) {
                self.hash = hash;
                return self;
            });
    }

    this.interpret = function InterpretMovieDetails() {
        var ptn = parseTorrentName(this.fileNameWithoutExtension);
        var sr  = sceneRelease(this.fileNameWithoutExtension);

        if (!this.title) {
            this.title = ptn.title || sr.title;
        }

        this.episode      = ptn.episode    || sr.episode;
        this.season       = ptn.season     || sr.season;
        this.releaseGroup = ptn.group      || sr.group;
        this.audio        = ptn.audio      || sr.audio;
        this.codec        = ptn.codec      || sr.video;
        this.quality      = ptn.quality    || sr.type;
        this.resoultion   = ptn.resoultion || sr.resoultion;
        this.year         = ptn.year       || sr.year;
        this.episodeName  = ptn.episodeName;

        //console.debug('interpreter:', ptn, sr);
        //console.debug('Movie:', this);

        return this;
    }

    return this;
};

module.exports = Movie;
