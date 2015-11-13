'use strict';

var expect = require("chai").expect;
var Dao = require('../../resources/Lang/Dao');

describe("Lang/Dao", function() {

    var lang;

    before(function Init() {
        lang = Dao.createForTest();
    });

    after(function Cleanup() {
        lang.clear();
    });

    it("createInstanceShouldOk", function() {
        expect(lang.get).to.be.a('function');
        expect(lang.set).to.be.a('function');
        expect(lang.clear).to.be.a('function');
    });

    it("saveVariableShouldBeOk", function() {
        lang.set('hu');
        expect(lang.get()).to.be.equal('hu');
    });

    it("variableShouldBePersistent", function() {
        expect(lang.get()).to.be.equal('hu');
    });

    it("clearShouldBeCleanPersistedData", function() {
        lang.clear();
        expect(lang.get()).to.be.null;
    });

    it("setVariableShouldBeUpdatable", function() {
        lang.set('es');
        lang.set('hu');
        expect(lang.get()).to.be.equal('hu');
    });
});
