console.log('OSX MENU');

var gui = require('nw.gui');
var win = gui.Window.get();

// Extend application menu for Mac OS
if (process.platform == "darwin") {
    var menu = new gui.Menu({type: "menubar"});
    menu.createMacBuiltin && menu.createMacBuiltin(window.document.title);
    win.menu = menu;
}

/*
var menu2 = new gui.Menu();
menu2.append(new gui.MenuItem({ type: 'checkbox', label: 'Apple' }));
menu2.append(new gui.MenuItem({ type: 'checkbox', label: 'Banana' }));
menu2.append(new gui.MenuItem({ type: 'checkbox', label: 'Strawberry' }));
menu2.append(new gui.MenuItem({ type: 'checkbox', label: 'Pear' }));
menu2.append(new gui.MenuItem({ type: 'separator' }));
var info_item = new gui.MenuItem({ label: 'Which Fruit Do I Love?' });
menu2.append(info_item);

console.log('meu')
document.getElementsByTagName('body')[0].addEventListener('click', function(ev) {
    ev.preventDefault();
    menu2.popup(ev.x, ev.y);
    return false;
});
*/