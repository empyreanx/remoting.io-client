'use strict';

function Proxy(client, instanceId, exports) {
	this.client = client;
	this.instanceId = instanceId;
	this.exports = exports;
}

module.exports = Proxy;
