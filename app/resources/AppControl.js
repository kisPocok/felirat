
var gui = require('nw.gui');
var Q   = require('q');
var Movie = require('./resources/Movie');
var Subtitle = require('./resources/Subtitle');
//var preloader = require('./resources/Preloader');

var win = gui.Window.get();
var DogTitle = {};

// Developer Console
win.showDevTools();

win.on('minimize', function() {
    console.log('Window is minimized');
});

// Extend application menu for Mac OS
if (process.platform == "darwin") {
    var menu = new gui.Menu({type: "menubar"});
    menu.createMacBuiltin && menu.createMacBuiltin(window.document.title);
    win.menu = menu;
}

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
        addToQueue(file);
    }
    this.className = '';
    return false;
};




var DogTitle = {
    name: 'alma',
    itemList: [],
    state: 0,
    getItemByFile: function (file) {
        var i;
        for (i in this.itemList) {
            if (this.itemList[i].name === file.name) {
                return this.itemList[i];
            }
        }
        return null;
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

    var listItem = document.createElement('li');
    listItem.className = 'list-item-' + DogTitle.getLastItem().name;
    listItem.innerHTML = '<span>' + DogTitle.getLastItem().name + '</span><i class="material-icons  rotating">loop</i>'
    UI.elements.list.appendChild(listItem);
});

var showQueue = function () {
    // TODO animálni kell itt
    UI.elements.queue.style.display = 'inline-block';
};

var addToQueue = function (file) {
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

    new Movie(file.name, file.path)
        .interpret()
        .calculateFileSize()
        .calculateHash()
        .then(function (movie) {
            var subtitle = new Subtitle(movie, 'hun');
            return subtitle;
        })
        .then(downloadSubtitle)
        .then(function (response) {
            console.log('kész', subtitleReady(file));
        })
        .catch(function (e) {
            subtitleFailed(file);
            console.error(e.stack);
        })
        .done(function () {
            //checkQueueStatus(); // TODO ez nem ide kellene!
        });
};


var subtitleFinished = function (newState) {
    return function (file) {
        var row = DogTitle.getItemByFile(file);
        if (row && newState) {
            row.state = newState;
            return true;
        }
        return false;
    };
};
var subtitleReady = subtitleFinished('done');
var subtitleFailed = subtitleFinished('error_outline');


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


var downloadSubtitle = function DownloadSubtitle(Subtitle) {

    var Movie = Subtitle.for;
    var lang = Subtitle.lang;

    // TODO ha fájlnévből nem megy mappa nevéből esetleg?

    var MovieHelper = require('./resources/MovieHelper');
    if (MovieHelper.isSubtitle(Movie.fileName) === true) {
        console.log('Huh?'); // TODO feliratot nem töltünk le újra :)
        return;
    }

    if (MovieHelper.isDir(Movie.path) === true) {
        console.log('Directory not supported yet!'); // TODO filename-et ellenőrízni, hogy mappa-e. Ha igen minden benne lévő fájlt csekkolni kell.
        return;
    }

    var Q           = require('q');
    var Subtitle    = require('./resources/OpenSubtitles');
    var subtitleApi = new Subtitle();
    var getSubtitle = require('./resources/SubtitleDownloader');

    var deferred = Q.defer();
    var passSourceAndOutputParams = MovieHelper.wrapperPassSourceAndOutputParams(subtitleApi, Movie.fileName, Movie.path, lang);

    Q.longStackSupport = true;
    Q.try(subtitleApi.connect())
        .then(subtitleApi.logIn('CommanderSub', 'yY9oSnSYt9', 'OSTestUserAgent'))
        .then(function (connection) {
            return Q.any([
                subtitleApi.searchSubtitlesByHash(Movie.hash, Movie.sizeInBytes, lang)(connection),
                subtitleApi.searchSubtitles(Movie.fileNameWithoutExtension, Movie.season, Movie.episode, lang, 1)(connection),
                subtitleApi.searchSubtitlesByFileName(Movie.fileName, lang)(connection)
            ]);
        })
        .then(function AnyPromiseFulfilled(response) {
            console.log('WTF?', response);
            if (response.data === false) {
                //return Q(subtitleApi.searchSubtitles(Movie.fileNameWithoutExtension, Movie.season, Movie.episode, lang, 1));
            }
            return response;
        }, function AllPromiseRejected() {
            console.log('EACH PROMISE ARE DEAD');
        })
        /*
        .then(function (response) {
            if (response.data === false) {
                console.log('FAIL :(');
            }
            return response;
        })*/
        /*
        .allSettled()
        .settled(function (a,b) {
            console.log(a,b);
        })
        */
        .then(passSourceAndOutputParams)
        .then(getSubtitle)
        .then(function (downloadStatus) {
            var response = {
                writable: downloadStatus.writable,
                path: downloadStatus.path,
                mode: downloadStatus.mode,
                flags: downloadStatus.flags
            };
            return response;
        })
        .then(deferred.resolve)
        .catch(deferred.reject)
        .done();

    return deferred.promise;
};
