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
		var response = { id: 0, type: 'services', result: ['TestService1', 'TestService2'] };
		
		socket.send = function (object) {
			expect(object).to.eql({ id: 0, type: 'services' });
			socket.emit('message', JSON.stringify(response));
		};
		
		client.services().then(function (result) {
			expect(result).to.eql(response.result);
			done();
		});
	});
	
	it('should handle error response', function (done) {
		var response = { id: 0, type: 'error', name: 'Error', message: 'Test error' };
		
		socket.send = function (object) {
			expect(object).to.eql({ id: 0, type: 'services' });
			socket.emit('message', JSON.stringify(response));
		};
		
		client.services().catch(function (error) {
			expect(error.name).to.be(response.name);
			expect(error.message).to.be(response.message);
			done();
		});
	});
	
	it('should handle bad response type', function (done) {
		var response = { id: 0, type: 'bad' };
		
		socket.send = function (object) {
			expect(object).to.eql({ id: 0, type: 'services' });
			socket.emit('message', JSON.stringify(response));
		};
		
		client.services().catch(function (error) {
			expect(error.name).to.be('InvalidResponse');
			done();
		});
	});
	
	it('should request exports list and handle response', function (done) {
		var response = { id: 0, type: 'exports', result: ['test1', 'test2'] };
		
		socket.send = function (object) {
			expect(object).to.eql({ id: 0, type: 'exports', service: 'TestService' });
			socket.emit('message', JSON.stringify(response));
		};
		
		client.exports('TestService').then(function (result) {
			expect(result).to.eql(response.result);
			done();
		});
	});
	
	it('should request instance and return a proxy', function (done) {
		var response = { id: 0, type: 'instance', result: { instance: 0, exports: ['test1', 'test2'] } };
		
		socket.send = function (object) {
			expect(object).to.eql({ id: 0, type: 'instance', service: 'TestService' });
			socket.emit('message', JSON.stringify(response));
		};
		
		client.instance('TestService').then(function (proxy) {
			expect(proxy.constructor.name).to.be('Proxy');
			done();
		});
	});
});
