/** Global variables **/
var
    Q = require('q'),
    $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),

    // Files
    fs = require('fs'),
    path = require('path'),

    // GUI
    gui = require('nw.gui'),
    win = gui.Window.get(),
    data_path = gui.App.dataPath
;
