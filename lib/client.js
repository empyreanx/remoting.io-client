'use strict';

var Promise = require('es6-promise').Promise;
var Proxy = require('./proxy');
var NamedError = require('./namederror');

/*
 * The Remoting.IO RPC client.
 */
function Client(socket) {
	this.socket = socket;
	this.id = 0;
}

/*
 * Internal method for serializing an object to JSON and sending it.
 */
Client.prototype.send = function (object) {
	this.socket.send(JSON.stringify(object));
};

/*
 * Internal shortcut for parsing a JSON message.
 */
Client.prototype.parse = function (message) {
	return JSON.parse(message);
};

/*
 * Internal method that returns a promise which waits for a given response from the server.
 */
Client.prototype.responsePromise = function (id, type) {
	var self = this;
	
	return new Promise(function (resolve, reject) {
		self.socket.on('message', function handler(message) {
			var response = self.parse(message);
			
			if (response && response.id === id) {
				self.socket.off('message', handler);
				
				if (response.type === type) {
					resolve(response.result);
				} else if (response.type === 'error') {
					reject(new NamedError(response.name, response.message));
				} else {
					reject(new NamedError('InvalidResponse', 'Invalid response type'));
				}
			}
		});
	});
};

/*
 * Internal method for returning and incrementing the request ID.
 */
Client.prototype.nextId = function () {
	return this.id++;
};

/*
 * Returns a promise that resolves the list of services exposed by the server.
 */
Client.prototype.services = function () {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'services');
	
	this.send({ id: id, type: 'services' });
	
	return promise;
};

/*
 * Returns a promise that resolves the list of methods exported by a particular service.
 */
Client.prototype.exports = function (serviceName) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'exports');
	
	this.send({ id: id, type: 'exports', service: serviceName });
	
	return promise;
};

/*
 * Returns a promise that resolves a proxy for a given service.
 */
Client.prototype.proxy = function (serviceName) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'instance');
	
	this.send({ id: id, type: 'instance', service: serviceName });
	
	var self = this;
	
	return new Promise(function (resolve, reject) {
		promise.then(function (result) {
			resolve(new Proxy(self, result.instance, result.exports));
		}).catch(function (error) {
			reject(error);
		});
	});
};

/*
 * Internal method that returns a promise which resolves the result of a method invocation on the server.
 */
Client.prototype.invoke = function (instanceId, method, args) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'invoke');
	
	this.send({ id: id, type: 'invoke', instance: instanceId, method: method, args: args });
	
	return promise;
};

/*
 * Internal method that releases an instance of a service held by a proxy. This methods returns
 * a promise for consistency.
 */
Client.prototype.release = function (instanceId) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'release');
	
	this.send({ id: id, type: 'release', instance: instanceId });
	
	return promise;
};

module.exports = Client;
