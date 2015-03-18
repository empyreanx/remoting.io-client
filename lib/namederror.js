'use strict';

/*
 * Convenience class for specifying errors with names
 * in addition to messages.
 */
function NamedError(name, message) {
	this.name = name;
	this.message = message;
}

NamedError.prototype = Object.create(Error.prototype);
NamedError.prototype.constructor = NamedError;

module.exports = NamedError;
