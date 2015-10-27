/**
 *
 * Methods for making internal http requests
 * 
 */

var http = require('http');
var cookie = require('cookie');

function noop() {}

function parseCookies(cookies){
	var ret = [];

	for(var key in cookies){
		ret.push(cookie.serialize(key, cookies[key]));
	}

	return ret.join("; ");
}

module.exports = {

	fireAndForget: function(port, fn){
		var opts = {
			host: 'localhost',
			port: port,
			path: '/'
		};

		if (!fn){
			fn = noop;
		}

		var req = http.get(opts, function(resp){

			resp.on('data', function(){
				fn();
			});

		});

		req.on('error', fn);
	},

	fireForCookies: function(port, fn){ 
		var opts = {
			host: 'localhost',
			port: port,
			path: '/'
		};

		var req = http.get(opts, function(resp){
			var cookies = cookie.parse(resp.headers['set-cookie'].join('; '));
			fn(null, cookies);
		});

		req.on('error', fn);
	},

	fireWithCookies: function(port, cookies, fn){
		var opts = {
			host: 'localhost',
			port: port,
			path: '/',
			headers: {
				cookie: parseCookies(cookies)
			}
		};

		var req = http.get(opts, function(resp){
			var cookies = cookie.parse(resp.headers['set-cookie'].join('; '));
			fn(null, cookies);
		});

		req.on('error', fn);
	}

};
