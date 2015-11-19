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

    describe("collectVideoFiles", function() {
        it("shouldReturnFile", function () {
            var results = Scan.collectVideoFiles(videoFolder, 2);

            expect(results).to.be.instanceof(Array);
            expect(results.length).to.be.equal(3);

            results.map(function (file) {
                expect(file).to.be.instanceof(File);
                expect(file.isDir).to.be.false;
                expect(file.isVideo).to.be.true;

                var contain = file.path.indexOf(file.fileName);
                expect(contain).to.be.equal(file.path.length - file.fileName.length);
            });
        });

        it("depth2ShouldFindVideoIn1DepthDir", function () {
            var results = Scan.collectVideoFiles(videoFolder + '/1DepthDir', 2);
            expect(results.length).to.be.equal(1);
        });
        it("depth2ShouldFindNoVideoIn1DepthDir", function () {
            var results = Scan.collectVideoFiles(videoFolder + '/1DepthDir', 1);
            expect(results.length).to.be.equal(0);
        });

        it("depth3ShouldFindVideoIn2DepthDir", function () {
            var results = Scan.collectVideoFiles(videoFolder + '/2DepthDir', 3);
            expect(results.length).to.be.equal(1);
        });
        it("depth3ShouldFindNoVideoIn2DepthDir", function () {
            var results = Scan.collectVideoFiles(videoFolder + '/2DepthDir', 2);
            expect(results.length).to.be.equal(0);
        });

        it("depth4ShouldFindVideoIn3DepthDir", function () {
            var results = Scan.collectVideoFiles(videoFolder + '/3DepthDir', 4);
            expect(results.length).to.be.equal(1);
        });
        it("depth4ShouldFindNoVideoIn3DepthDir", function () {
            var results = Scan.collectVideoFiles(videoFolder + '/3DepthDir', 3);
            expect(results.length).to.be.equal(0);
        });
    });
});
