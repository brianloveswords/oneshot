# oneshot [![Build Status](https://secure.travis-ci.org/brianloveswords/oneshot.png?branch=master)](http://travis-ci.org/brianloveswords/oneshot)

Testing server for serving a single resource and shutting down, either after N requests (usually 1).

# Usage

```bash
$ npm install oneshot
```

```js
var oneshot = require('oneshot');

// Serves one response and shuts down. Assigns to a random port and
// calls back with a reference to the server and a parsed url, ready
// for passing to `http.request`.
oneshot({ body: 'goodbye, world\n' }, function(server, urlobj) {
  http.request(urlobj, function (res) {
    res.pipe(process.stdout); // pipes 'goodbye world' to stdout
  }).end();
});
```

```js
// You can pass in `type` to serve a specific content-type...
oneshot({
  body: 'alert("badical");',
  type: 'application/javascript'
}, function (server, urlobj) {
  http.request(urlobj, function (res) {
    console.log(res.headers['content-type']) // `application/json`
  });
});
```

```js
// Or you can use the headers object to do whatever you want with
// headers. WHATEVER YOU WANT.
oneshot({
  body: '<h1>awesome</h1>',
  headers: {
    'content-type': 'text/html',
    'vary': 'Accept-Encoding',
    'x-frame-options': 'SAMEORIGIN'
  }
}, function (server, urlobj) {
  // …
});
```

# Options
**body**: The content you want to send. Can be a string or a buffer.

**type**: Sets the `content-type` header.

**redirect**: URL to redirect to before serving (default: `null`)

**endless**: Redirect forever (default: `false`)

**requests**: Number of requests to serve (default: `1`)

**statusCode**: The status code to return (default: `200`)

**headers**: Object of headers.
