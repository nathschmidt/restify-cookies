var cookie = require('cookie');

function CookieParser(){}

	/**
	 * Parse function to be handed to restify server.use
2	 * 
	 * @param  {object}   req
	 * @param  {object}   res 
	 * @param  {Function} next
	 * @return {undefined}
	 */
	CookieParser.prototype.parse = function (req, res, next){
		var self = this;
		var cookieHeader = req.headers.cookie;

		req.cookies = cookie.parse(cookieHeader);

		/**
		 * Add a cookie to our response.  Uses a Set-Cookie header
		 * per cookie added.
		 * 
		 * @param {String} key  - Cookie name
		 * @param {String} val  - Cookie value
		 * @param {[type]} opts - Options object can contain path, secure, 
		 *     expires, domain, http
		 */
		res.addCookie = function(key, val, opts){

			var HEADER = "Set-Cookie";
			if(res.header(HEADER)){

				var curCookies = res.header(HEADER);

				if(!curCookies instanceof Array){
					curCookies = [curCookies];
				}
				
				curCookies.push( cookies.serialize(key, val, opts) );

				res.header(HEADER, curCookies);

			} else {

				res.header(HEADER, cookie.serialize(key,val, opts));

			}
		};
	};

module.exports = CookieParser;