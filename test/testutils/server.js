/**
 * Creates a full HTTP server for testing purposes.
 * 
 */

var restify = require('restify');
var restifyCookies = require('../../index');


module.exports = function (port, fn){
	var server = restify.createServer();

	server.use(restifyCookies.parse);
	server.listen(port, function(){
		fn();
	});

	return server;
};
