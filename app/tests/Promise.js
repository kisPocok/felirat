'use strict';

var should = require("chai").should();

module.exports = (function PromiseTest() {

    var expectPromise = function (promise) {
        promise.should.have.property("then");
        promise.should.have.property("fail");
    };

    var extendPromise = function (promise) {

        expectPromise(promise);

        promise.shouldDone = function (done) {
            done();
        };

        promise.shouldFail = function (done) {
            done();
        };

        promise.shouldThrow = function (exceptionMsg, done) {
            var missingException = function () {
                should.equal(undefined, exceptionMsg);
                done();
            };

            promise.fail(function (e) {
                if (e.toString().toLowerCase().match(exceptionMsg.toLowerCase())) {
                    done();
                }
                missingException();
            }).done(missingException);
        };

        return promise;
    };

    return {
        'givenPromise': extendPromise
    };
})();
