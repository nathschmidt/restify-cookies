var cookie = require('cookie');

module.exports = {
	/**
	 * Parse function to be handed to restify server.use
	 * 
	 * @param  {object}   req
	 * @param  {object}   res 
	 * @param  {Function} next
	 * @return {undefined}
	 */
	parse: function(req, res, next){
		var self = this;
		var cookieHeader = req.headers.cookie;

		if(cookieHeader){
			req.cookies = cookie.parse(cookieHeader);
		} else {
			req.cookies = {};
		}

		/**
		 * Add a cookie to our response.  Uses a Set-Cookie header
		 * per cookie added.
		 * 
		 * @param {String} key  - Cookie name
		 * @param {String} val  - Cookie value
		 * @param {[type]} opts - Options object can contain path, secure, 
		 *     expires, domain, http
		 */
		res.setCookie = function(key, val, opts){

			var HEADER = "Set-Cookie";
			if(res.header(HEADER)){

				var curCookies = res.header(HEADER);

				if( !(curCookies instanceof Array) ) {
					curCookies = [curCookies];
				}
				
				curCookies.push( cookie.serialize(key, val, opts) );

				res.header(HEADER, curCookies);

			} else {

				res.header(HEADER, cookie.serialize(key,val, opts));

			}
		};

		next();

	}
};