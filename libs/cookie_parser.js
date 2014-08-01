var cookie = require('cookie');
var cookieSign = require('cookie-signature');

function CookieParser(){}

	CookieParser.prototype.parse = function (req, res, next){
		var self = this;
		var cookieHeader = req.headers.cookie;

		req.cookies = cookie.parse(cookieHeader);

		res.addCookie = function(key, val){
			if(res.header('cookie')){

				var curCookies = res.header('cookie');
				curCookies = [curCookies, "; ", cookies.stringify(key, val)].join("; ");
				res.header('cookie', curCookies);

			} else {

				res.header('cookie', cookie.stringify(key,val));

			}
		};
	};