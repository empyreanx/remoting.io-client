'use strict';

/*
 * Encapsulates a proxy of a service exposed by the server.
 */
function Proxy(client, instanceId, exports) {
	this.client = client;
	this.instanceId = instanceId;
	
	var self = this;
	
	for (var i = 0; i < exports.length; i++) {
		var method = exports[i];
		self[method] = this.registerMethod(method);
	}
}

/*
 * An internal method that creates a function which invokes the appropriate methods on
 * the server.
 */
Proxy.prototype.registerMethod = function (method) {
	return function () {
		return this.client.invoke(this.instanceId, method, Array.prototype.slice.call(arguments));
	};
};

/*
 * Releases the instance associated with this proxy on the server. Note: all instances are
 * released when the client disconnects (i.e. closes the webpage), so calling this method isn't
 * required, but it is good practice.
 */
Proxy.prototype.release = function () {
	return this.client.release(this.instanceId);
};

module.exports = Proxy;
