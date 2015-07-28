module.exports = function LangHelper (db) {
    this.get = function GetLang () {
        return db.getItem('lang') || 'eng';
    };
    this.set = function SetLang (lang) {
        return db.setItem('lang', lang);
    };
    this.updateLanguageSelector = function UpdateHTMLSelect () {
       this.getLanguageSelector().value = this.get();
    };
    this.onLanguageSelectorChange = function (e) {
        this.set(this.getLanguageSelector().value);
    };
    this.getLanguageSelector = function () {
        return this.document.getElementById('lang');
    };
    this.init = function (document) {
        this.document = document;
        this.updateLanguageSelector();
        this.getLanguageSelector()
            .addEventListener("change", this.onLanguageSelectorChange.bind(this));
        return this;
    };

    return this;
};