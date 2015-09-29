var MovieFile = require("./MovieFile");

var delayTime = 1000;
var dummy = function (action, delay) {
    var self = this;
    delay = delay || 600;
    delayTime += delay;
    setTimeout(function () {
        if (typeof action === 'function') {
            return console.debug('Dummy | inline_function', action.bind(self));
        }
        var response = eval(action);
        if (response !== undefined) {
            console.debug('Dummy | ' + action + ' -->', response);
        } else {
            console.debug('Dummy | ' + action);
        }
    }, delayTime);

    return this;
};

var TWD = new MovieFile(
    'The.Walking.Dead.S05.HUN.WEB-DL.XviD-DART.mkv',
    '/Users/vault/Desktop/The.Walking.Dead.S05.HUN.WEB-DL.XviD-DART.mkv'
);
var GOT = new MovieFile(
    'Game.of.Thrones.S05E10.HDTV.XviD.HUN-SLN.mkv',
    '/Users/vault/Desktop/Game.of.Thrones.S05E10.HDTV.XviD.HUN-SLN.mkv'
);
var FLASH = new MovieFile(
    'The.Flash.2014.S01E04.Going.Rogue.1080p.WEB-DL.DD5.1.H.264-NTb.mkv',
    '/Users/vault/Desktop/The.Flash.2014.S01E04.Going.Rogue.1080p.WEB-DL.DD5.1.H.264-NTb.mkv'
);
var DD = new MovieFile(
    'Daredevil.S01E01.720p.WEBRip.x264-SNEAkY.mkv',
    '/Users/vault/Downloads/Daredevil.S01.PROPER.720p.WEBRip.x264-SNEAkY/Daredevil.S01E01.720p.WEBRip.x264-SNEAkY.mkv'
);
var ROBO = new MovieFile(
    'mr.robot.s01e07.1080p.hdtv.x264-tastetv.mkv',
    '/Users/vault/Movies/_seed/Mr.Robot.S01E07.1080p.HDTV.x264-TASTETV/mr.robot.s01e07.1080p.hdtv.x264-tastetv.mkv'
);
module.exports = function RunDummy(UI) {
    console.log('Dummy is running');
    dummy.call(UI, UI.showQueue, 0);
    // TODO dummy.call(this, "addToQueue(ROBO)", 100);
    //dummy("addToQueue(ROBO)");
    //dummy("addToQueue(GOT)");
    //dummy("addToQueue(FLASH)");
    //dummy("addToQueue(DD)");
    //dummy("subtitleFailed(TWD)", 1500);
    //dummy("subtitleReady(GOT)", 1000);
};
