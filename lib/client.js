'use strict';

var Promise = require('es6-promise').Promise;
var Proxy = require('./proxy');
var NamedError = require('./namederror');

function Client(socket) {
	this.socket = socket;
	this.id = 0;
}

Client.prototype.send = function (object) {
	this.socket.send(JSON.stringify(object));
};

Client.prototype.parse = function (message) {
	return JSON.parse(message);
};

Client.prototype.responsePromise = function (id, type) {
	var self = this;
	
	return new Promise(function (resolve, reject) {
		function handler(message) {
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
		}
		
		self.socket.on('message', handler);
	});
};

Client.prototype.nextId = function () {
	return this.id++;
};

Client.prototype.services = function () {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'services');
	
	this.socket.send({ id: id, type: 'services' });
	
	return promise;
};

Client.prototype.exports = function (serviceName) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'exports');
	
	this.socket.send({ id: id, type: 'exports', service: serviceName });
	
	return promise;
};

Client.prototype.instance = function (serviceName) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'instance');
	
	this.socket.send({ id: id, type: 'instance', service: serviceName });
	
	var self = this;
	
	return new Promise(function (resolve, reject) {
		promise.then(function (result) {
			resolve(new Proxy(self, result.instance, result.exports));
		}).catch(function (error) {
			reject(error);
		});
	});
};

Client.prototype.invoke = function (instanceId, method, args) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'invoke');
	
	this.socket.send({ id: id, type: 'invoke', instance: instanceId, method: method, args: args });
	
	return promise;
};

Client.prototype.release = function (instanceId) {
	var id = this.nextId();
	
	var promise = this.responsePromise(id, 'release');
	
	this.socket.send({ id: id, type: 'release', instance: instanceId });
	
	return promise;
};

module.exports = Client;
