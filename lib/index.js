if (window) {
	window.io = window.io || {};
	
	window.io.remoting = function (socket) {
		return new window.io.remoting.Client(socket);
	};
	
	window.io.remoting.Client = require('./client');
} else {
	exports = module.exports = function (socket) {
		return new exports.Client(socket);
	};
	
	exports.Client = require('./client');
}
