Restify-Cookies
===============

Adds cookie reading/setting to restify.

Adds the request.cookie object, which is a hash containing all the key-value cookie pairs sent with this request.  For setting cookies adds the response.addCookie method, which takes a key-value pair and addes it to the cookie header.

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
  
  res.send(JSON.stringify(cookies));

});

server.listen(8080);
```

Cookie Options
--------------

Cookies can have options specified detailing the lifetime of the cookie, the domain, the paths the cookie is set for, https only and disallowing javascript access to the cookie. To set these options use addCookie with the optional third parameter. 
The Third parameter is a hash containing these fields

  - path      - A string path the cookie is valid for,
  - expires   - Date object for when the cookie should expire,
  - maxAge    - Numer of seconds until the cookie should expire,
  - domain    - The domain the cookie will be sent over,
  - secure    - Set to true if the cookie should only be sent for https requests,
  - httpOnly  - Set to true to disable client-side manipulation of the cookie

Example:
```javascript

  res.setCookie('myCookie', 'Hi There', {
    path: '/home/',
    domain:'www.example.com',
    maxAge: 60,
    secure: true,
    httpOnly: true
  });

```

License
-------

MIT License
