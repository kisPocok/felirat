'use strict';

var fs = require('fs');
var expect = require("chai").expect;
var should = require("chai").should();
var Helper = require('../../resources/Movie/Helper');

var createDirectoryIfNotExists = function (path, chmod) {
    try {
        fs.lstatSync(path);
    } catch (e) {
        fs.mkdirSync(path);
    }
    fs.chmodSync(path, chmod);
};
var createUnreadableDirectory = function (path) {
    return createDirectoryIfNotExists(path, '312');
};
var createUnwritableDirDirectory = function (path) {
    return createDirectoryIfNotExists(path, '556');
};


describe("Movie/Helper", function() {
    describe("isDir", function() {
        it("validDirShouldPass", function() {
            var actual = Helper.isDir('.');
            expect(true).to.equal(actual);
        });
        it("invalidDirectoryShouldThrowEnoentError", function() {
            expect(Helper.isDir.bind(Helper, './ValidatorTest.js')).to.throw(/ENOENT/); // No such file or dir
        });
        it("unreadableDirectoryShouldThrowEaccessError", function() {
            var path = './test/Movie/Test_UnreadableDir/';
            createUnreadableDirectory(path);
            expect(Helper.isDir.bind(Helper, path)).to.throw(/EACCES/); // permission denied
        });
    });

    describe("isWritable", function() {
        it("writableDirectoryShouldPass", function() {
            expect(Helper.isWritable.bind(Helper, './test/Movie/')).to.not.throw(/E/);
        });
        it("unwritableDirectoryShouldThrowEaccessError", function() {
            var path = './test/Movie/Test_UnwritableDir/';
            createUnwritableDirDirectory(path);
            expect(Helper.isWritable.bind(Helper, path)).to.throw(/EACCES/); // permission denied
        });
    });

    describe("isReadable", function() {
        it("readDirectoryShouldPass", function() {
            expect(Helper.isReadable.bind(Helper, './test/Movie/')).to.not.throw(/E/);
        });
        it("readableDirectoryShouldntThrowEaccessError", function() {
            var path = './test/Movie/Test_UnreadableDir/';
            createUnreadableDirectory(path);
            expect(Helper.isReadable.bind(Helper, path)).to.throw(/EACCES/); // permission denied
        });
    });

    describe("removeFileExtension", function() {
        it("removeFileExtensionShouldPass", function() {
            var expected = 'Walking.Dead.s06e01';
            var actual = Helper.removeFileExtension(expected + '.mkv');
            expect(expected).to.equal(actual);
        });
        it("withoutExtensionShouldPassOriginalValue", function() {
            var data = 'almafa';
            var actual = Helper.removeFileExtension(data);
            expect(data).to.equal(actual);
        });
    });

    describe("getFileExtension", function() {
        it("rightFileNameShouldPass", function() {
            var data = 'Walking.Dead.s06e01.mkv';
            var actual = Helper.getFileExtension(data);
            expect('mkv').to.equal(actual);
        });
        it("withoutExtensionShouldPassOriginalValue", function() {
            var data = 'almafa';
            var actual = Helper.getFileExtension(data);
            expect(data).to.equal(actual);
        });
    });
});
