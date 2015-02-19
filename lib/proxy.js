'use strict';

function Proxy(client, instance) {
	this.client = client;
	this.instance = instance;
}

Proxy.prototype.release = function () {
	
};

module.exports = Proxy;
