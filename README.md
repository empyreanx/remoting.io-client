# Remoting.IO Client

Simple and transparent remote procedure calls (RPC) using `Engine.IO`.

The server repository is located [here](https://github.com/jrimclean/remoting.io).

## About

`Remoting.IO` allows services to export methods remotely. Services are simply plain prototypical Javascript classes which define a number of methods that can be called remotely.

Because `Engine.IO` is connection oriented, services are stateful. This means session data can be persisted across services and method invocations. `Remoting.IO` provides a `session` hash map that is injected into instances of services for exactly this purpose.

`Remoting.IO` is able to handle both synchronous and asynchronous methods. The only constraint is that asynchronous methods must return an ES6 promise.

Because `Remoting.IO` is based on `Engine.IO`, it inherits the strengths of `Engine.IO`, such as multiple transports and resilience in the presence of proxies, load balancers, and firewalls.

## Installation
Install the `Engine.IO` and `Remoting.IO` clients as follows:

	npm install engine.io-client
	npm install remoting.io-client

## Usage

Assuming the server exposes a service named `TestService`, which exports a method named `test`, we can remotely request an instance of the service and call it's method as follows:

```js
var socket = eio('ws://localhost');
var client = rio(socket);
	
client.instance('TestService').then(function (proxy) {
	proxy.test('Hello', 'World!').then(function (result) {
		console.log(result);
		proxy.release();
	});	
});
```

This example assumes that `engine.io.js` and `remoting.io.js` have been loaded into the DOM. 

Using Browserify:

```js
var socket = require('engine.io-client')('ws://localhost');
var client = require('remoting.io-client')(socket);
	
client.instance('TestService').then(function (proxy) {
	proxy.test('Hello', 'World!').then(function (result) {
		console.log(result);
		proxy.release();
	});	
});
```

## API

#### Client

- **constructor**
	- Initializes the client
	- **Parameters:**
		- `socket`: an `Engine.IO` (or equivalent) socket
		
- **services**
	- Returns a `Promise` containing the list of services exposed by the server
	
- **exports**
	- Returns a `Promise` containing the list of methods exported by a service
	- **Parameters:**
		- `serviceName`: the service

- **instance**
	- Returns a `Promise` containing a proxy of the service
	- **Parameters:**
		- `serviceName`: the service

#### Proxy
	
- **release**
	- Releases the proxy. Should be called when the proxy is no longer in use.

Head over to the `Remoting.IO` [server](https://github.com/jrimclean/remoting.io) repository for instructions on how to use the server.

## License
Copyright (c) 2015 James McLean  
Licensed under the MIT license.
