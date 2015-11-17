'use strict';

var expect = require("chai").expect;
var File = require('../../resources/Scan/File');

describe("Scan/File", function() {
    it("shouldPutClosingSlashIntoPath", function () {
        var file = new File(__dirname, 'FileTest.js');

        file.should.have.property('path');
        file.should.have.property('isDir');
        file.should.have.property('fileName');

        expect(file.isDir).to.be.false;
        expect(file.path).to.be.equal(__filename);
    });
});
