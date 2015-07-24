
var gui = require('nw.gui');
var Q   = require('q');
var O   = require('observed')
var md5 = require('md5');
var Movie = require('./resources/Movie');
var MovieFile = require('./resources/MovieFile');
//var preloader = require('./resources/Preloader');

var win = gui.Window.get();
var DogTitle = {};

// Developer Console
win.showDevTools();

win.on('minimize', function() {
    console.log('Window is minimized');
});

//localStorage.lang = 'hun'

var exceptions = [
    'mdl-card__title',
    'mdl-card__supporting-text',
    'mdl-card__dropfiles',
    //'mdl-card__title  mdl-card--expand', // TODO ez nem maga a container?
    'mdl-card__actions mdl-card--border',
    'mdl-button__ripple-container',
    'material-icons',
];

var UI = new (function DogTitleUI () {
    this.elements = {
        'header':      document.getElementById('section-header'),
        'description': document.getElementById('section-description'),
        'queue':       document.getElementById('section-queue'),
        'list':        document.getElementById('list')
    };

    this.appBody = document.getElementsByTagName('body')[0];
    this.onFileDrag = function () {
        this.appBody.className = 'dragging';
    };
    this.onFileDrop = function () {
        this.appBody.classname = '';
    };
    this.showList = function () {
        // TODO
        this.elements.description.style.display = 'none'; // .hide()
        this.elements.queue.style.display = 'block'; // .show()
        this.elements.header.className = 'mdl-card__title  mdl-card--expand  small'; // addClass('small')
    };
    this.showQueue = function () {
        UI.elements.queue.style.display = 'inline-block';
    };
    this.getListItem = function (fileName) {
        return document.getElementsByClassName('list-item-' + fileName)[0];
    };
    this.createListItem = function CreateItemThenReturnsHTMLQuery(MovieFile) {
        var name = MovieFile.fileName;
        var hash = 'dt' + md5('movie' + name);
        var className = 'list-item-' + hash;
        var length = UI.elements.list.getElementsByClassName(className).length;
        var id = hash + '-' + length;

        //var spin  = '<i id="tooltip-' + id + '" class="material-icons  movie-status  rotating">loop</i>';
        var spin    = '<i id="tooltip-' + id + '" class="movie-status  mdl-spinner  mdl-js-spinner  is-active"></i>';
        var tooltip = '<span class="movie-tooltip  mdl-tooltip" for="tooltip-' + id + '" style="display:none;">Hello world!</span>';
        var title   = '<span class="movie-title">' + name + '</span>';

        var item = document.createElement('li');
        item.className = className;
        item.id = id;
        item.innerHTML = title + spin + tooltip;
        UI.elements.list.appendChild(item);

        this.initMaterialDesign();

        return '#' + item.id;
    };
    // Material Design Lite (re)init
    this.initMaterialDesign = componentHandler.upgradeAllRegistered

    return this;
});

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

UI.appBody.ondragenter = function (e) {
    e.preventDefault();
    this.classList.add('over');
}
UI.appBody.ondragover = function (e) {
    e.preventDefault();
    UI.onFileDrag();
};
UI.appBody.ondragleave = function (e) {
    e.preventDefault();
    this.classList.remove('over');
    if (e.target.className && exceptions.indexOf(e.target.className) === -1) {
        UI.onFileDrop();
    }
};
UI.appBody.ondrop = function (e) {
    e.preventDefault();
    var length = e.dataTransfer.files.length;
    for (var i = 0; i < length; i++) {
        var file = e.dataTransfer.files[i];
        addToQueue(new MovieFile(file.name, file.path));
    }
    this.className = '';
    return false;
};

var DogTitle = {
    itemList: [],
    state: null,
    getItemsByFile: function (MovieFile) {
        var i, items = [];
        for (i in this.itemList) {
            if (this.itemList[i].fileName === MovieFile.fileName) {
                items.push(this.itemList[i]);
            }
        }
        return items;
    }
};


//var DogTitleObserver = O(DogTitle);


var addToQueue = function AddSubtitleToQueue(MovieFile) {
    MovieFile.state = 'waiting';
    MovieFile.htmlQuery = UI.createListItem(MovieFile);
    var index = DogTitle.itemList.push(MovieFile);
    var itemObserver = O(DogTitle.itemList[--index]);

    itemObserver.on('change', function (event) {
        var MovieFile = event.object;
        var status = event.value;

        var item = UI.elements.list.querySelector(MovieFile.htmlQuery);
        var icon = item.getElementsByClassName('movie-status')[0];
        //var tooltip = item.getElementsByClassName('movie-tooltip')[0];
        if (status !== 'waiting') {
            icon.className = icon.className.replace(/mdl-js-spinner  is-active/, 'material-icons'); // drop spinner, use icon instead
            //tooltip.style.display = 'block';
        }
        icon.innerHTML = status;
    });

    var subtitleFinished = function (newState) {
        return function (MovieFile, message) {
            //console.debug('State:', newState, file)
            var rows = DogTitle.getItemsByFile(MovieFile);
            rows.map(function (MovieFile) {
                MovieFile.state = newState;

                if (newState === 'error_outline') {
                    var item = UI.elements.list.querySelector(MovieFile.htmlQuery);
                    var tooltip = item.getElementsByClassName('movie-tooltip')[0];
                    tooltip.innerHTML = message;
                    tooltip.style.display = 'block';
                    UI.initMaterialDesign();
                }
            });
        };
    };
    var subtitleReady  = subtitleFinished('done');
    var subtitleFailed = subtitleFinished('error_outline');

    var MovieHelper      = require('./resources/MovieHelper');
    var SubtitleRequest  = require('./resources/SubtitleRequest');
    var downloadSubtitle = require('./resources/SubtitleDownloader');

    var createSubtitleRequest = function CreateSubtitleRequest(lang) {
        return function (movie) {
            return new SubtitleRequest(movie, lang);
        }
    }

    var lang = 'hun' // TODO
    var movie = new Movie(MovieFile.fileName, MovieFile.path);
    var populateMovie = function (Movie) {
        return Movie
            .interpret()
            .calculateFileSize()
            .calculateHash();
    }
    var searchResponseTransform = MovieHelper.wrapperPassSourceAndOutputParams(movie, lang);

    Q
        .try(function GetMovie() { return movie; })
        .then(validateMovie)
        .then(populateMovie)
        .then(createSubtitleRequest(lang))
        .then(searchSubtitle)
        .then(searchResponseTransform)
        .then(downloadSubtitle)
        //.then(function Debug(r) { console.debug('debug in queue:', r); return r; })
        .then(function (downloadResponse) {
            console.debug('output:', downloadResponse)
            subtitleReady(MovieFile);
        })
        .catch(function (error) {
            subtitleFailed(MovieFile, error.message);
            console.error(error.message);
        })
        .done();
};

var validateMovie = function ValidateMovie(Movie) {
    var MovieHelper = require('./resources/MovieHelper');
    if (MovieHelper.isSubtitle(Movie.fileName) === true) {
        // TODO feliratot nem töltünk le újra :)
        throw new Error('Huh?');
    }


    if (MovieHelper.isDir(Movie.path) === true) {
        // TODO filename-et ellenőrízni, hogy mappa-e. Ha igen minden benne lévő fájlt csekkolni kell.
        throw new Error('Directory not supported yet!');
    }
    return Movie;
};

var createConnection = function Connect() {
    var OpenSubtitleApi = require('./resources/OpenSubtitles');
    var API = new OpenSubtitleApi();

    var ConnectionError = function (error) {
        console.error('Connection Error:', error);
    };

    var AuthError = function (error) {
        console.error('Auth Error:', error.code);
    };

    var connectionPromise = Q.try(API.connect())
        .catch(ConnectionError)
        .then(API.logIn('CommanderSub', 'yY9oSnSYt9', 'OSTestUserAgent'))
        .catch(AuthError);;

    return function getConnection() {
        return connectionPromise;
    };
};

var searchSubtitle = function SearchSub(SubtitleRequest) {
    var Movie = SubtitleRequest.for;
    var lang = SubtitleRequest.lang;

    // TODO ha fájlnévből nem megy mappa nevéből esetleg?

    var OpenSubtitleApi = require('./resources/OpenSubtitles');
    var API = new OpenSubtitleApi();
    var apiConnection = createConnection();
    var deferred = Q.defer();

    Q
        // Search by hash
        .try(apiConnection)
        .then(API.searchSubtitlesByHash(Movie.hash, Movie.sizeInBytes, lang))
        .then(deferred.resolve)

        // Search by title
        .catch(apiConnection)
        .then(API.searchSubtitles(Movie.title, Movie.season, Movie.episode, lang, 1))
        .then(deferred.resolve)

        // Search by file name
        .catch(apiConnection)
        .then(API.searchSubtitlesByFileName(Movie.fileName, lang))
        .then(deferred.resolve)

        // End it
        //.then(function Debug(r) { console.debug('debug in queue:', r); return r; })
        .catch(deferred.reject)
        .done(function () {
            // TODO drop the connection / logout
        });

    return deferred.promise;
};
