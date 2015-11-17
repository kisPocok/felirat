'use strict';

var expect = require("chai").expect;
//var should = require("chai").should();
//var sinon = require("sinon");

var File = require('../../resources/Scan/File');
var givenPromise = require('../Promise').givenPromise;
var helper = require('../../resources/Movie/Helper');
var object = require('../../resources/Scan/Logic');
var Scan = new object();

describe("Scan/Logic", function() {

    var videoFolder = './tmp/example-videos';
    var files = ['.git','1DepthDir', '2DepthDir', '3DepthDir', 'CopyPaste', 'EmptyDir', 'FullSeason', 'README.md', 'RenamedDir', 'SampleTest'];
    var fileList = Scan.createFileList(videoFolder, files);

    var readDirectory = function (path) {
        var promise = Scan.readDirectory(path);
        return givenPromise(promise);
    };

    // Init
    before(function Init() {
        if (!helper.isDir(videoFolder)) {
            var clone = require("nodegit").Clone.clone;
            return clone("https://github.com/kisPocok/example-videos.git", videoFolder, null);
        }
    });

    describe("readDirectory", function() {
        it("missingDirectoryShouldFail", readDirectory(false).shouldFail);
        it("givenDirectoryShouldBeDone", readDirectory(videoFolder).shouldDone);
        it("givenFakeDirectoryShouldBeThrowException", function (done) {
            readDirectory(videoFolder + 'fake/').shouldThrow('wrong path', done);
        });

        it("givenDirectoryShouldReturnFiles", function (done) {
            readDirectory(videoFolder).expect(function (response, pureResponse) {
                response.to.be.an('array');
                response.to.be.deep.members(fileList);
                expect(pureResponse.length).to.be.equal(files.length);
            }, done);
        });
    });

    describe("filters", function() {
        it("shouldRemainOnlyDirectories", function () {
            Scan.filterOutFiles(fileList).map(function (File) {
                expect(File.isDir).to.be.true;
            });
        });
        it("shouldRemainOnlyNonDirectories", function () {
            Scan.filterOutFolders(fileList).map(function (File) {
                expect(File.isDir).to.be.false;
            });
        });
    });

    describe("createFileList", function() {
        it("shouldRemainOnlyDirectories", function () {
            var fileList = Scan.createFileList(videoFolder, files)

            expect(fileList).to.be.an('array');
            expect(fileList.length).to.be.equal(files.length);

            fileList.map(function (singleFile) {
                expect(singleFile).to.be.instanceof(File);
            });
        });
    });
});
