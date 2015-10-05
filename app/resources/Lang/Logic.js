var Dao = require('./Dao');

module.exports = function LangLogic() {
    this.db = Dao.createDefault();

    this.useTestDB = function () {
        this.db = Dao.createForTest();
        return this;
    }.bind(this);

    this.get = function GetLang () {
        return this.db.get('lang') || 'eng';
    }.bind(this);

    this.set = function SetLang (lang) {
        return this.db.set(lang);
    }.bind(this);

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
