'use strict';

//var expect = require("chai").expect;
//var should = require("chai").should();
//var sinon = require("sinon");
var clone = require("nodegit").Clone.clone;

var helper = require('../../resources/Movie/Helper');
var object = require('../../resources/Scan/Logic');
var Scan = new object();

describe("Scan/Logic", function() {
    var videoFolder = './tmp/example-videos';
    var givenPromise = require('../Promise').givenPromise;

    // Init
    before(function Init() {
        if (!helper.isDir(videoFolder)) {
            return clone("https://github.com/kisPocok/example-videos.git", videoFolder, null);
        }
    });

    describe("readDirectory", function() {
        var readDirectory = function (path) {
            var promise = Scan.readDirectory(path);
            return givenPromise(promise);
        };

        it("missingDirectoryShouldFail", readDirectory(false).shouldFail);
        it("givenDirectoryShouldBeDone", readDirectory(videoFolder).shouldDone);
        it("givenFakeDirectoryShouldBeThrowException", function (done) {
            readDirectory(videoFolder + 'fake/').shouldThrow('wrong path', done);
        });
    });
});
