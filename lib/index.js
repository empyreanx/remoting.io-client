if (window) {
	window.io = window.io || {};
	
	window.io.remoting = function (socket) {
		var Client = require('./client');
		return new Client(socket);
	};
} else {
	module.exports = function (socket) {
		var Client = require('./client');
		return new Client(socket);
	};
}
