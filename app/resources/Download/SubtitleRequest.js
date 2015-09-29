module.exports = function SubtitleRequest(source, destination) {
    this.source = source;
    this.destination = destination;

    var isSourceValid = function CheckSource() {
        if (!this.toSource) {
            return false;
        }

        // TODO
        return true;
    };

    var isDestinationWritable = function CheckDestination() {
        if (!this.destination) {
            return false;
        }

        // TODO
        return true;
    };

    this.validate = function Validate() {
        if (!isSourceValid.call(this)) {
            throw new Error('Invalid subtitle url!');
        }

        if (!isDestinationWritable.call(this)) {
            throw new Error('Destination isn\'t writable!');
        }

        return this;
    };

    return this.validate();
};
