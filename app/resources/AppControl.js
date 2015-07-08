
var gui = require('nw.gui')
var win = gui.Window.get();

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

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var appBody = document.getElementsByTagName('body')[0];
appBody.ondragenter = function (e) {
    e.preventDefault();
    this.classList.add('over');
}
appBody.ondragover = function (e) {
    e.preventDefault();
    this.className = 'dragging';
};
appBody.ondragleave = function (e) {
    e.preventDefault();
    this.classList.remove('over');
    console.log('leave', e.target)
    if (e.target.className && exceptions.indexOf(e.target.className) === -1) {
        console.log('MIFASZ?', e.target.className)
        this.className = '';
    }
};
appBody.ondrop = function (e) {
    e.preventDefault();
    var length = e.dataTransfer.files.length;
    for (var i = 0; i < length; i++) {
        var file = e.dataTransfer.files[i];
        console.log('Download sub:', file);
        // TODO addToQueue
        downloadSubtitle(file.name, file.path, 'hun');
    }
    this.className = '';
    return false;
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