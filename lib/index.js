if (window) {
	window.rio = function (socket) {
		return new window.rio.Client(socket);
	};
	
	window.rio.Client = require('./client');
} else {
	exports = module.exports = function (socket) {
		return new exports.Client(socket);
	};
	
	exports.Client = require('./client');
}
