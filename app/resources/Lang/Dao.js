var StorageProvider = require('node-localstorage').LocalStorage;

var LangDao = function LangDao(storage) {
    var LocalStorage = new StorageProvider(storage);

    this.get = function GetLang () {
        return LocalStorage.getItem('lang');
    };

    this.set = function SetLang (lang) {
        return LocalStorage.setItem('lang', lang);
    };

    this.clear = function ClearLang () {
        return LocalStorage.clear('lang');
    };

    return this;
};

module.exports = {
    'createDefault': function () { return new LangDao('../storage'); },
    'createForTest': function () { return new LangDao('../storage/test'); }
};
