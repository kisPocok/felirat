
var gui = require('nw.gui')

/* hide window while the app is loading
onload = function() {
    gui.Window.get().show();
}
*/

var win = gui.Window.get();
var DogTitle = {};

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

// Developer Console
var win = gui.Window.get(); win.showDevTools();
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
    this.appBody = document.getElementsByTagName('body')[0];
    this.onFileDrag = function () {
        this.appBody.className = 'dragging';
    };
    this.onFileDrop = function () {
        this.appBody.classname = '';
    }
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
        //console.log('Download sub for:', file);
        // TODO addToQueue
        //downloadSubtitle(file.name, file.path, 'hun');
        addToQueue(file);
    }
    this.className = '';
    return false;
};

var DogTitle = {
    name: 'alma',
    itemList: [],
    state: 0,
    getLastItem: function () {
        var length = this.itemList.length;
        return this.itemList[length-1];
    }
};
var O = require('observed')
var DogTitleObserver = O(DogTitle);
DogTitleObserver.on('change itemList.length', function (event) {
    DogTitle.state = event.value; // update the current state
    showQueue();
    console.log('onChange', event);
    var list = document.getElementById('list');
    var row = document.createElement('li');
    console.log('He?', DogTitle.getLastItem().name);
    row.innerHTML = '<span>' + DogTitle.getLastItem().name + '</span><i class="material-icons">queue</i>'
    list.appendChild(row);
    console.log('done');
});

var showQueue = function () {
    document.getElementById('queue').style.display = 'inline-block';
}
var addToQueue = function (file) {
    DogTitle.itemList.push(file);
};


var downloadSubtitle = function (filename, path, lang) {

    // TODO ha fájlnévből nem megy mappa nevéből esetleg?
    // TODO filename végén kiterjesztést le kell szedni! (mkv/mp4/mi más?)

    var MovieHelper = require('./resources/MovieHelper');
    if (MovieHelper.isSubtitle(filename) === true) {
        console.log('Huh?'); // TODO feliratot nem töltünk le újra :)
        return;
    }

    if (MovieHelper.isDir(path) === true) {
        console.log('Directory not supported yet!'); // TODO filename-et ellenőrízni, hogy mappa-e. Ha igen minden benne lévő fájlt csekkolni kell.
        return;
    }

    var Q            = require('q');
    var Subtitle     = require('./resources/OpenSubtitles');
    var subtitleApi  = new Subtitle();
    var downloadSubtitle = require('./resources/SubtitleDownloader');

    var passSourceAndOutputParams = MovieHelper.wrapperPassSourceAndOutputParams(subtitleApi, filename, path, lang);

    Q.fcall(subtitleApi.connect())
        .then(subtitleApi.logIn('CommanderSub', 'yY9oSnSYt9', 'OSTestUserAgent'))
        .then(subtitleApi.searchSubtitles(filename, 1, 1, 'hun', 1))
        .then(passSourceAndOutputParams)
        .then(downloadSubtitle)
        .then(function (downloadStatus) {
            var response = {
                writable: downloadStatus.writable,
                path: downloadStatus.path,
                mode: downloadStatus.mode,
                flags: downloadStatus.flags
            };
            console.log('Download response:', response);
            return response;
        })
        .catch(function (error) {
            console.log('errors', error);
        })
        .done();
};