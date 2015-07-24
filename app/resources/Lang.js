if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

module.exports = function Language (document) {
    this.get = function GetLang () {
        return localStorage.getItem('lang') || 'eng';
    };
    this.set = function SetLang (lang) {
        return localStorage.setItem('lang', lang);
    };
    this.updateHtmlSelect = function UpdateHTMLSelect () {
        return document.getElementById('lang').value = this.get();
    };
    return this;
};