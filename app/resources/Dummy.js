
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

onload = function () {
    console.log('Dummy init')
    //dummy("UI.appBody.className = 'dragging';");
    //dummy("UI.appBody.className = '';");
    dummy("UI.showList()");
    //dummy("addToQueue(TWD)");
    dummy("addToQueue(GOT)");
    //dummy("subtitleFailed(TWD)", 1500);
    dummy("subtitleReady(GOT)", 1000);
};
