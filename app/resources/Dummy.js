var delayTime = 1000;
var dummy = function (action, delay) {
    delay = delay || 600;
    delayTime += delay;
    setTimeout(function () {
        console.log('Dummy |', action);
        if (typeof action === 'function') {
            return action();
        }
        return eval(action);
    }, delayTime);
}

var TWD = {
    name: 'The.Walking.Dead.S05.HUN.WEB-DL.XviD-DART.mkv',
    path: '/Users/vault/Desktop/The.Walking.Dead.S05.HUN.WEB-DL.XviD-DART.mkv'
};
var GOT = {
    name: 'Game.of.Thrones.S05E10.HDTV.XviD.HUN-SLN.mkv',
    path: '/Users/vault/Desktop/Game.of.Thrones.S05E10.HDTV.XviD.HUN-SLN.mkv'
};
var FLASH = {
    name: 'The.Flash.2014.S01E04.Going.Rogue.1080p.WEB-DL.DD5.1.H.264-NTb.mkv',
    path: '/Users/vault/Desktop/The.Flash.2014.S01E04.Going.Rogue.1080p.WEB-DL.DD5.1.H.264-NTb.mkv'
};
var DD = {
    name: 'Daredevil.S01E01.720p.WEBRip.x264-SNEAkY.mkv',
    path: '/Users/vault/Downloads/Daredevil.S01.PROPER.720p.WEBRip.x264-SNEAkY/Daredevil.S01E01.720p.WEBRip.x264-SNEAkY.mkv'
};
var ROBO = {
    name: 'Mr.Robot.S01E03.d3bug.1080p.WEB-DL.DD5.1.H.264-RARBG.mkv',
    path: '/Users/vault/Desktop/Mr.Robot.S01E03.d3bug.1080p.WEB-DL.DD5.1.H.264-RARBG.mkv'
};
onload = function () {
    console.log('Dummy init')
    //dummy("UI.appBody.className = 'dragging';");
    //dummy("UI.appBody.className = '';");
    dummy("UI.showList()", 0);
    //dummy("addToQueue(TWD)");
    //dummy("addToQueue(GOT)");
    //dummy("addToQueue(FLASH)");
    dummy("addToQueue(ROBO)");
    //dummy("addToQueue(DD)");
    //dummy("subtitleFailed(TWD)", 1500);
    //dummy("subtitleReady(GOT)", 1000);
};
