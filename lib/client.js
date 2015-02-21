'use strict';

var Promise = require('es6-promise').Promise;
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
	var that = this;
	
	return new Promise(function (resolve, reject) {
		function handler(message) {
			var response = that.parse(message);
			
			if (response && response.id === id) {
				that.socket.off('message', handler);
				
				if (response.type === type) {
					resolve(response.result);
				} else if (response.type === 'error') {
					reject(new NamedError(response.name, response.message));
				} else {
					reject(new NamedError('InvalidResponse', 'Invalid response type'));
				}
			}
		}
		
		that.socket.on('message', handler);
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

module.exports = Client;
