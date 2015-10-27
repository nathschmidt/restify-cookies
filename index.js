var cookie = require('cookie');

function merge (dst, src) {
	for (var i = 1; src = arguments[i], i < arguments.length; ++i)
		for (var p in src)
			if (src.hasOwnProperty(p) && !dst.hasOwnProperty(p) &&
					dst[p] !== src[p]) dst[p] = src[p];
	return dst;
}

module.exports = {
	/**
	 * Parse function to be handed to restify server.use
	 * 
	 * @param  {object}   req
	 * @param  {object}   res 
	 * @param  {Function} next
	 * @return {undefined}
	 */
	parse: function parseCookies (req, res, next){
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
		res.setCookie = function setCookie (key, val, opts){

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

		res.clearCookie = function clearCookie (key, opts) {
			var options = merge({
				expires: new Date(1)
			}, opts)
			res.setCookie(key, '', options)
		}

		next();

	}
};