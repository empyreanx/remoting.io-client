'use strict';

function Proxy(client, instanceId, exports) {
	this.client = client;
	this.instanceId = instanceId;
	
	var self = this;
	
	for (var i = 0; i < exports.length; i++) {
		var method = exports[i];
		self[method] = this.registerMethod(method);
	}
}

Proxy.prototype.registerMethod = function (method) {
	return function () {
		return this.client.invoke(this.instanceId, method, Array.prototype.slice.call(arguments));
	};
};

Proxy.prototype.release = function () {
	return this.client.release(this.instanceId);
};

module.exports = Proxy;
