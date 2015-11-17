'use strict';

var expect = require("chai").expect;
var should = require("chai").should();

module.exports = (function PromiseTest() {

    var expectPromise = function (promise) {
        promise.should.have.property("then");
        promise.should.have.property("fail");
    };

    var extendPromise = function (promise) {

        expectPromise(promise);

        /**
         * Expect to success
         *
         * @param done
         */
        promise.shouldDone = function (done) {
            promise.then(function () {
                done();
            }).fail(done);
        };

        /**
         * Expect to fail
         *
         * @param done
         */
        promise.shouldFail = function (done) {
            promise.then(function () {
                done(new Error('This should fail.'));
            }).fail(function (error) {
                done(); // without error. it's OK for now
            });
        };

        /**
         * Expect the given exception
         *
         * @param exceptionMsg
         * @param done
         */
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

        /**
         * Fill the callback with expectations
         *
         * @param callback
         * @param done
         */
        promise.expect = function (callback, done) {
            return promise.then(function (response) {
                var expectedResponse = expect(response);
                callback(expectedResponse, response);
                done();
            }).fail(done);
        };

        return promise;
    };

    return {
        'givenPromise': extendPromise
    };
})();
