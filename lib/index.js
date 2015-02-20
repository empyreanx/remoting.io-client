window.io = window.io || {};

window.io.remoting = function (socket) {
	var Client = require('./client');
	return new Client(socket);
};
