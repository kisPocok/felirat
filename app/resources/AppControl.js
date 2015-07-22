
var gui = require('nw.gui');
var Q   = require('q');
var Movie = require('./resources/Movie');
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
    this.getListItem = function (fileName) {
        return document.getElementsByClassName('list-item-' + fileName)[0];
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

        // TODO ezt itt szebben kellene...
        addToQueue({
            name:  file.name,
            path:  file.path,
            state: 'loading'
        });
    }
    this.className = '';
    return false;
};




var DogTitle = {
    name: 'alma',
    itemList: [],
    state: 0,
    getItemsByFile: function (file) {
        var i, items = [];
        for (i in this.itemList) {
            if (this.itemList[i].name === file.name) {
                items.push(this.itemList[i]);
            }
        }
        return items;
    },
    getLastItem: function () {
        var length = this.itemList.length;
        return this.itemList[length-1];
    }
};
var O = require('observed')
var DogTitleObserver = O(DogTitle);
DogTitleObserver.on('change itemList.length', function (event) {
    // Ha a queue változik, generál hozzá html-t
    DogTitle.state = event.value; // update the current state
    showQueue(); // TODO ez nem ide kell

    // TODO var spin = '<p class="mdl-spinner mdl-spinner--small mdl-js-spinner is-active"></p>';
    var listItem = document.createElement('li');
    listItem.className = 'list-item-' + DogTitle.getLastItem().name;
    listItem.innerHTML = '<span>' + DogTitle.getLastItem().name + '</span><i class="material-icons  rotating">loop</i>'
    UI.elements.list.appendChild(listItem);
});

var showQueue = function () {
    // TODO animálni kell itt
    UI.elements.queue.style.display = 'inline-block';
};

var addToQueue = function AddSubtitleToQueue(file) {
    file.state = 'waiting';
    DogTitle.itemList.push(file);

    // watch the current item
    var itemWatcher = O(DogTitle.getLastItem());
    itemWatcher.on('change', function (event) {
        var row = UI.getListItem(event.object.name);
        var icon = row.getElementsByTagName('i')[0];
        icon.className = icon.className.replace(/rotating/, '');
        icon.innerHTML = event.value;
    });

    var MovieHelper = require('./resources/MovieHelper');
    var downloadSubtitle = require('./resources/SubtitleDownloader');

    var lang = 'hun' // TODO
    var movie = new Movie(file.name, file.path);
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
            console.log('output:', output)
            subtitleReady(file);
        })
        .catch(function (error) {
            subtitleFailed(file);
            console.error(error);
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
    return function (file) {
        //console.debug('State:', newState, file)
        var rows = DogTitle.getItemsByFile(file);
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

var getConnection = function Connect() {
    var OpenSubtitleApi = require('./resources/OpenSubtitles');
    var API = new OpenSubtitleApi();

    var ConnectionError = function (error) {
        console.error('Connection Error:', error);
    };

    var AuthError = function (error) {
        console.error('Auth Error:', error);
    };

    return function Connect() {
        return Q.try(API.connect())
            .catch(ConnectionError)
            .then(API.logIn('CommanderSub', 'yY9oSnSYt9', 'OSTestUserAgent'))
            .catch(AuthError);
    };
};

var searchSubtitle = function SearchSub(SubtitleRequest) {
    var Movie = SubtitleRequest.for;
    var lang = SubtitleRequest.lang;

    // TODO ha fájlnévből nem megy mappa nevéből esetleg?

    var OpenSubtitleApi = require('./resources/OpenSubtitles');
    var API = new OpenSubtitleApi();
    var createConnection = getConnection();
    var deferred = Q.defer();

    Q
        // Search by hash
        .try(createConnection)
        .then(API.searchSubtitlesByHash(Movie.hash+'aa', Movie.sizeInBytes, lang))
        .then(deferred.resolve)

        // Search by title
        .catch(createConnection)
        .then(API.searchSubtitles(Movie.title, Movie.season, Movie.episode, lang, 1))
        .then(deferred.resolve)

        // Search by file name
        .catch(createConnection)
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
