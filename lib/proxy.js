'use strict';

function proxyMethod(client, instanceId, method) {
	return function () {
		return client.invoke(instanceId, method, Array.prototype.slice.call(arguments));
	};
}

function Proxy(client, instanceId, exports) {
	var that = this;
	
	for (var i = 0; i < exports.length; i++) {
		var method = exports[i];
		that[method] = proxyMethod(client, instanceId, method);
	}
}

module.exports = Proxy;
