'use strict';

var fs = require('fs');
var tools = require('../Tools');
var expect = require("chai").expect;
var should = require("chai").should();
var Helper = require('../../resources/Movie/Helper');

describe("Movie/Helper", function() {
    var unreadableDir = './tests/Test_UnreadableDir/';
    var unwritableDir = './tests/Test_UnwritableDir/';

    describe("isDir", function() {
        it("validDirShouldPass", function() {
            var actual = Helper.isDir('.');
            expect(actual).to.equal(true);
        });
        it("invalidDirectoryShouldThrowEnoentError", function() {
            expect(Helper.isDir.bind(Helper, './HelperTest.js')).to.throw(/ENOENT/); // No such file or dir
        });
        it("unreadableDirectoryShouldThrowEaccessError", function() {
            tools.createUnreadableDirectory(unreadableDir);
            expect(Helper.isDir.bind(Helper, unreadableDir)).to.throw(/EACCES/); // permission denied
        });
    });

    describe("isVideo", function() {
        it("mp4ShouldBeVideo", function() {
            var actual = Helper.isVideo('example.mp4');
            expect(actual).to.equal(true);
        });
        it("mkvShouldBeVideo", function() {
            var actual = Helper.isVideo('example.mkv');
            expect(actual).to.equal(true);
        });
        it("mp3ShouldBeFalse", function() {
            var actual = Helper.isVideo('example.mp3');
            expect(actual).to.equal(false);
        });
        it("directoryShouldBeFalse", function() {
            var actual = Helper.isVideo('example/');
            expect(actual).to.equal(false);
        });
    });

    describe("isWritable", function() {
        it("writableDirectoryShouldPass", function() {
            expect(Helper.isWritable.bind(Helper, './tests/Movie/')).to.not.throw(/E/);
        });
        it("unwritableDirectoryShouldThrowEaccessError", function() {
            tools.createUnwritableDirDirectory(unwritableDir);
            expect(Helper.isWritable.bind(Helper, unwritableDir)).to.throw(/EACCES/); // permission denied
        });
    });

    describe("isReadable", function() {
        it("readDirectoryShouldPass", function() {
            expect(Helper.isReadable.bind(Helper, './tests/Movie/')).to.not.throw(/E/);
        });
        it("readableDirectoryShouldntThrowEaccessError", function() {
            tools.createUnreadableDirectory(unreadableDir);
            expect(Helper.isReadable.bind(Helper, unreadableDir)).to.throw(/EACCES/); // permission denied
        });
    });

    describe("removeFileExtension", function() {
        it("removeFileExtensionShouldPass", function() {
            var expected = 'Walking.Dead.s06e01';
            var actual = Helper.removeFileExtension(expected + '.mkv');
            expect(actual).to.equal(expected);
        });
        it("withoutExtensionShouldPassOriginalValue", function() {
            var data = 'almafa';
            var actual = Helper.removeFileExtension(data);
            expect(actual).to.equal(data);
        });
    });

    describe("getFileExtension", function() {
        it("rightFileNameShouldPass", function() {
            var data = 'Walking.Dead.s06e01.mkv';
            var actual = Helper.getFileExtension(data);
            expect(actual).to.equal('mkv');
        });
        it("withoutExtensionShouldPassOriginalValue", function() {
            var data = 'almafa';
            var actual = Helper.getFileExtension(data);
            expect(actual).to.equal(data);
        });
    });

    describe("isSubtitle", function () {
        it("srtShouldBeValid", function() {
            var data = 'example.srt';
            var actual = Helper.isSubtitle(data);
            expect(actual).to.be.true;
        });
        it("mkvShouldBeInValid", function() {
            var data = 'example.mkv';
            var actual = Helper.isSubtitle(data);
            expect(actual).to.be.false;
        });
    });

    describe("baseDir", function () {
        var dir  = './example/';

        it("filePathShouldBeValidDirectory", function() {
            var file = 'file.mkv';
            var actual = Helper.baseDir(dir + file);
            expect(actual).to.equal(dir);
        });
        it("directoryShouldBeEqual", function() {
            var anotherDir = 'alma/';
            var actual = Helper.baseDir(dir + anotherDir);
            expect(actual).to.equal(dir + anotherDir);
        });
    });

    describe("srtFileName", function () {
        it("shouldBeValidFileName", function() {
            var lang = 'hun';
            var fileName = 'The.Walking.Dead.s01e01';
            var actual = Helper.srtFileName(fileName, lang);
            expect(actual).to.equal(fileName + '.' + lang + '.srt');
        });
    });

    // Cleanup
    after(function Cleanup() {
        fs.rmdirSync(unreadableDir);
        fs.rmdirSync(unwritableDir);
    });

});
