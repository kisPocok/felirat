'use strict';

var expect = require("chai").expect;
var Logic = require('../../resources/Lang/Logic');

describe("Lang/Logic", function() {

    var logic;

    before(function Init() {
        logic = new Logic().useTestDB();
    });

    it("createInstanceShouldOk", function() {
        expect(logic.get).to.be.a('function');
        expect(logic.set).to.be.a('function');

        expect(logic.init).to.be.a('function');
        expect(logic.updateLanguageSelector).to.be.a('function');
        expect(logic.getLanguageSelector).to.be.a('function');
        expect(logic.onLanguageSelectorChange).to.be.a('function');
    });

    it("logicGetWithoutPersistentDataShouldReturnEngAsDefault", function () {
        expect(logic.get()).to.equal('eng');
    });

    it("logicUseTestDbShouldNotOverwriteLiveDB", function () {
        var liveLogic = new Logic();
        logic.set('hun');
        expect(liveLogic.get()).to.equal('eng');
    });
});
