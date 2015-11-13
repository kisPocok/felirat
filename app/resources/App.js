
win.showDevTools();

// Global App skeleton for backbone
var App = new Backbone.Marionette.Application();

_.extend(App, {
    Controller: {},
    View: {},
    Model: {},
    Page: {},
    Scrapers: {},
    Providers: {},
    Localization: {}
});

App.addRegions({
    Window: '.main-window-region'
});

//App.window.show(new MyView());
