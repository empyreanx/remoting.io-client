'use strict';

var Promise = require('promise');
var NamedError = require('./namederror');

function Client(socket) {
	this.socket = socket;
	this.nextId = 0;
}

Client.prototype.send = function (object) {
	this.socket.send(JSON.stringify(object));
};

Client.prototype.parse = function (message) {
	return JSON.parse(message);
};

Client.prototype.error = function (error) {
	return new NamedError(error.name, error.message);
};

Client.prototype.services = function () {
	var id = this.nextId++;
	
	var that = this;
	
	var promise = new Promise(function (resolve, reject) {
		function handler(message) {
			var response = that.parse(message);
	
			if (response && response.id === id) {
				that.socket.off('message', handler);
				
				switch (response.type) {
					case 'services':
						resolve(response.services);
						break;
					case 'error':
						reject(that.error(response));
						break;
					default:
						reject(new NamedError('InvalidResponse', 'Invalid response type'));
				}
			}
		}
		
		that.socket.on('message', handler);
	});
	
	this.socket.send({ id: id, type: 'services' });
	
	return promise;
};

Client.prototype.exports = function (serviceName) {
	var id = this.nextId++;
	
	var that = this;

	var promise = new Promise(function (resolve, reject) {
		function handler(message) {
			var response = that.parse(message);
	
			if (response && response.id === id) {
				that.socket.off('message', handler);
				
				switch (response.type) {
					case 'exports':
						resolve(response.exports);
						break;
					case 'error':
						reject(that.error(response));
						break;
					default:
						reject(new NamedError('InvalidResponse', 'Invalid response type'));
				}
			}
		}
		
		that.socket.on('message', handler);
	});
	
	this.socket.send({ id: id, type: 'exports', service: serviceName });
	
	return promise;
};

module.exports = Client;
