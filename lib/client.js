'use strict';

var Promise = require('promise');

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

Client.prototype.services = function () {
	var id = this.nextId++;
	
	var that = this;
	
	var promise = new Promise(function (resolve, reject) {
		function handler(message) {
			var response = that.parse(message);
	
			if (response.id === id) {
				that.socket.off('message', handler);
				
				if (response.type === 'services') {
					resolve(response.services);
				} else if (response.type === 'services') {
					reject();
				} else {
					reject();
				}
			}
		}
		
		that.socket.on('message', handler);
	});
	
	this.socket.send({ id: id, type: 'services' });
	
	return promise;
};

module.exports = Client;
