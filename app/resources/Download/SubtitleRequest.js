module.exports = function SubtitleRequest(source, destination) {
    this.source = source;
    this.destination = destination;
    var movieHelper = require('../Movie/Helper');

    /**
     * @return {boolean}
     */
    var isSourceValid = function CheckSource() {
        return this.source && this.source.match('^http(s?)://(.*)$');
    }.bind(this);

    /**
     * @return {boolean}
     */
    var isDestinationWritable = function CheckDestination() {
        try {
            movieHelper.isWritable(this.destination);
            return true;
        } catch (e) {
            return false;
        }
    }.bind(this);

    /**
     * @returns {exports}
     * @constructor
     */
    this.validate = function Validate() {
        if (!isSourceValid()) {
            throw new Error('Invalid subtitle url!');
        }

        if (!isDestinationWritable()) {
            throw new Error('Destination doesn\'t writable!');
        }

        return this;
    };

    return this;
};
