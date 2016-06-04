Restify-Cookies
===============

[![Join the chat at https://gitter.im/nathschmidt/restify-cookies](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nathschmidt/restify-cookies?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Adds cookie reading/setting to restify.

Adds the request.cookie object, which is a hash containing all the key-value cookie pairs sent with this request.  For setting cookies this adds the `response.setCookie` method, which takes a key and value and adds it to the cookie header.

```
response.setCookie('key', 'value'),
response.setCookie('key', 'value', cookieOptions);  // options explained below
```

There is also `response.clearCookie`, which will set the value of a cookie to an empty string.  It takes a key and optionally additional cookie options.

```
response.clearCookie('key');
response.clearCookie('key', cookieOptions);  // options explained below
```

Installation:

```bash
npm install restify-cookies
```

Example Usage:

```javascript
var CookieParser = require('restify-cookies');
var Restify = require('restify');

var server = Restify.createServer();

server.use(CookieParser.parse);

server.get('/', function(req, res, next){
  var cookies = req.cookies; // Gets read-only cookies from the request

  res.setCookie('my-new-cookie', 'Hi There'); // Adds a new cookie to the response

  if (req.cookies['my-old-cookie']){
    res.clearCookie('my-old-cookie');  // Remove this old cookie
  }
  
  res.send(JSON.stringify(cookies));

});

server.listen(8080);
```

Cookie Options
--------------

Cookies can have options specified detailing the lifetime of the cookie, the domain, the paths the cookie is set for, HTTPS only and disallowing JavaScript access to the cookie. To set these options use `setCookie` with the optional third parameter or `clearCookie` with the optional second parameter.

The cookie options object is a hash containing these fields:

  - path      - A string path the cookie is valid for. Default: no path.
  - expires   - Date object for when the cookie should expire. Default: No expiry.
  - maxAge    - Number of seconds until the cookie should expire. Default: No max age.
  - domain    - The domain the cookie will be sent over. Default: origin only.
  - secure    - Set to `true` if the cookie should only be sent for HTTPS requests. Default: `false`.
  - httpOnly  - Set to `true` to disable client-side manipulation of the cookie. Default: `false`.

Example:
```javascript

  res.setCookie('myCookie', 'Hi There', {
    path: '/home/',
    domain: 'www.example.com',
    maxAge: 60,
    secure: true,
    httpOnly: true
  });

```

License
-------

MIT License
