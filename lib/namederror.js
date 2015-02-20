'use strict';

function NamedError(name, message) {
	this.name = name;
	this.message = message;
}

NamedError.prototype = Object.create(Error.prototype);
NamedError.prototype.constructor = NamedError;

module.exports = NamedError;
