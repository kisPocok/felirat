
var gui = require('nw.gui');
var Q   = require('q');
var O   = require('observed')
var md5 = require('md5');
var Movie = require('./resources/Movie');
var MovieFile = require('./resources/MovieFile');
var SubtitleRequest = require('./resources/SubtitleRequest');
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
        'description': document.getElementById('description'),
        'queue':       document.getElementById('queue'),
        'list':        document.getElementById('list'),
        'header':      document.getElementById('almafa')
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
        // TODO var spin = '<p class="mdl-spinner mdl-spinner--small mdl-js-spinner is-active"></p>';
        var spin = '<i class="material-icons  rotating">loop</i>';

        var item = document.createElement('li');
        item.className = className;
        item.id = id;
        item.innerHTML = '<span>' + name + '</span>' + spin;
        UI.elements.list.appendChild(item);
        return '#' + item.id;
    };

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
    //console.log(UI);
    UI.onFileDrag();
};
UI.appBody.ondragleave = function (e) {
    e.preventDefault();
    this.classList.remove('over');
    //console.log('leave', e.target)
    if (e.target.className && exceptions.indexOf(e.target.className) === -1) {
        //console.log('MIFASZ?', e.target.className)
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
    name: 'alma',
    itemList: [],
    state: 0,
    getItemsByFile: function (MovieFile) {
        var i, items = [];
        for (i in this.itemList) {
            if (this.itemList[i].fileName === MovieFile.fileName) {
                items.push(this.itemList[i]);
            }
        }
        //console.log(items);
        return items;
    },
    getLastItem: function () {
        var length = this.itemList.length;
        return this.itemList[length-1];
    }
};
/*
var DogTitleObserver = O(DogTitle);

// Ha a queue változik, generál hozzá html-t
DogTitleObserver.on('change itemList.length', function (event) {
    // TODO var spin = '<p class="mdl-spinner mdl-spinner--small mdl-js-spinner is-active"></p>';
    var listItem = document.createElement('li');
    listItem.className = 'list-item-' + DogTitle.getLastItem().fileName;
    listItem.innerHTML = '<span>' + DogTitle.getLastItem().fileName + '</span><i class="material-icons  rotating">loop</i>'
    UI.elements.list.appendChild(listItem);

    // assign dom element to object
    var MovieFile = event.object;
    MovieFile.htmlElement = listItem;
});
*/

var addToQueue = function AddSubtitleToQueue(MovieFile) {
    MovieFile.state = 'waiting';
    MovieFile.htmlQuery = UI.createListItem(MovieFile);
    var index = DogTitle.itemList.push(MovieFile);
    var itemObserver = O(DogTitle.itemList[--index]);

    itemObserver.on('change', function (event) {
        var MovieFile = event.object;
        var status = event.value;

        var item = UI.elements.list.querySelector(MovieFile.htmlQuery);
        var icon = item.getElementsByTagName('i')[0];
        if (status !== 'waiting') {
            icon.className = icon.className.replace(/rotating/, '');
        }
        icon.innerHTML = status;
    });


    var MovieHelper = require('./resources/MovieHelper');
    var downloadSubtitle = require('./resources/SubtitleDownloader');

    var lang = 'hun' // TODO
    var movie = new Movie(MovieFile.fileName, MovieFile.path);
    var searchResponseTransform = MovieHelper.wrapperPassSourceAndOutputParams(movie, lang);

    movie
        .interpret()
        .calculateFileSize()
        .calculateHash()
        .then(validateMovie)
        .then(function CreateSubtitleRequest(movie) {
            return new SubtitleRequest(movie, lang);
        })
        .then(searchSubtitle)
        //.then(function Debug(r) { console.debug('debug in queue:', r); return r; })
        .then(searchResponseTransform)
        .then(downloadSubtitle)
        .then(function OutPut(result) {
            var response = {
                writable: result.writable,
                path:     result.path,
                mode:     result.mode,
                flags:    result.flags
            };
            return response;
        })
        .then(function (output) {
            console.debug('output:', output)
            subtitleReady(MovieFile);
        })
        .catch(function (error) {
            subtitleFailed(MovieFile);
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

    /* // TODO ez azért nem kell, mert hash nélkül is mennie kell a keresésnek
    if (movie.hash === '0000000000000000') {
        throw new Error('Wrong hash!')
    }
     */
    return Movie;
};


var subtitleFinished = function (newState) {
    return function (MovieFile) {
        //console.debug('State:', newState, file)
        var rows = DogTitle.getItemsByFile(MovieFile);
        rows.map(function (self) {
            self.state = newState;
        });
    };
};
var subtitleReady = subtitleFinished('done');
var subtitleFailed = subtitleFinished('error_outline');

/*
var queueCheckingInProgress = false;
var checkQueueStatus = function () {
    console.log('check state again');
    if (queueCheckingInProgress) {
        console.log('Checking already in progress... exit');
        return false;
    }
    queueCheckingInProgress = true;
    console.log('Checking...');
    //console.log('DogTitle', DogTitle);
};
*/

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
        .then(API.searchSubtitlesByHash(Movie.hash+'aa', Movie.sizeInBytes, lang))
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
