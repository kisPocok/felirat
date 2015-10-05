'use strict';

var fs = require("fs");
var expect = require("chai").expect;
var SubtitleRequest = require('../../resources/Download/SubtitleRequest');
var tools = require('../Tools');

describe("Download/SubtitleRequest", function() {

    var source = 'http://example_url';
    var destination = tools.getRootDir() + '/Test_Destination/';

    before(function Init() {
        tools.createExampleDirectory(destination);
    });

    after(function Cleanup() {
        fs.rmdirSync(destination);
    });

    it("createInstanceShouldOk", function() {
        var sub = new SubtitleRequest(source, destination);
        expect(sub.source).to.equal(source);
        expect(sub.destination).to.equal(destination);
    });

    it("validateSourceShouldPass", function () {
        var sub = new SubtitleRequest(source, destination);
        expect(sub.validate.bind(sub)).to.not.throw(/./);
        expect(sub.source).to.equal(source);
        expect(sub.destination).to.equal(destination);
    });

    it("missingSourceShouldThrowException", function () {
        var sub = new SubtitleRequest('', destination);
        expect(sub.validate.bind(sub)).to.throw(/url/);
    });

    it("missingDestinationShouldThrowException", function () {
        var sub = new SubtitleRequest(source, '');
        expect(sub.validate.bind(sub)).to.throw(/writable/);
    });

    it("invalideSourceShouldThrowException", function () {
        var sub = new SubtitleRequest('not_url', destination);
        expect(sub.validate.bind(sub)).to.throw(/url/);
    });
});
