
var delayTime = 1000;
var dummy = function (action, delay) {
    delay = delay || 750;
    delayTime += delay;
    setTimeout(function () {
        console.log('Dummy |', action);
        if (typeof action === 'function') {
            return action();
        }
        return eval(action);
    }, delayTime);
}

onload = function () {
    console.log('Dummy init')
    dummy("UI.appBody.className = 'dragging';");
    dummy("UI.appBody.className = '';");
    dummy("UI.appBody.className = 'dragging';");
    dummy("UI.appBody.className = '';");
};
