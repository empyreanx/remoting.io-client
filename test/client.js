var expect = require('expect.js');
var emitter = require('component-emitter');

function MockSocket () {
}

emitter(MockSocket.prototype);

describe('client', function () {
	var socket, client;
	
	beforeEach(function () {
		socket = new MockSocket();
		client = io.remoting(socket);
	});
	
	it('should request service list and handle response', function (done) {
		var response = { id: 0, type: 'services', services: ['TestService1', 'TestService2'] };
		
		socket.send = function (object) {
			expect(object).to.eql({ id: 0, type: 'services' });
			socket.emit('message', JSON.stringify(response));
		};
		
		client.services().done(function (result) {
			expect(result).to.eql(response.services);
			done();
		});
	});
});
