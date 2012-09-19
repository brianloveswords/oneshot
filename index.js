var http = require('http');
var urlutil = require('url');
var _ = require('lodash');

/**
 * (Async) Create a server that shuts down after serving a set amount
 * of requests. Useful for testing.
 *
 * @asynchronous
 * @param {Object} opts Properties
 *   - body: Response body
 *   - type: `Content-Type` to use. (default: 'text/plain')
 *   - redirect: URL to redirect to before serving (default: null)
 *   - endless: Redirect forever (default: false)
 *   - requests: Number of requests to serve (default: 1)
 *   - statusCude: The status code (default: 200)
 *   - headers: Hash of headers
 * @return {(callback)}
 *   - server object with added `get` method
 *   - url object for server
 */

function oneshot(opts, callback) {
  opts = _.defaults(opts, {
    body: null,
    type: 'text/plain',
    redirect: null,
    endless: false,
    requests: 1,
    statusCode: 200,
    headers: {},
  });
  var headers = _.defaults(opts.headers, {
    'Content-Length': opts.body.length,
    'Content-Type': opts.type
  });
  var redirect = opts.redirect;

  function normalResponse(req, resp) {
    resp.writeHead(opts.statusCode, headers);
    if (req.method === 'GET')
      resp.write(opts.body);
    resp.end();
    if (--opts.requests < 1)
      this.close();
  }

  function redirectResponse(req, resp) {
    resp.writeHead(301, {'Location': redirect});
    if (!opts.endless)
      redirect = null;
    resp.end();
  }

  return http.createServer(function (req, resp) {
    if (!redirect)
      return normalResponse.bind(this)(req, resp);
    return redirectResponse.bind(this)(req, resp);
  }).on('listening', function () {
    var url = 'http://localhost:' + this.address().port;
    var urlopts = urlutil.parse(url);
    this.get = oneshot.get.bind(this, urlopts);
    urlopts.method = 'GET';
    return callback(this, urlopts);
  }).listen(0);
};

module.exports = oneshot;
oneshot.get = function get(opts, callback) {
  if (!opts) throw new Error('no opts');
  opts.method = 'GET';
  var request = http.request(opts, function (res) {
    var body = '';
    res.on('data', function (buf) {
      return body += buf;
    }).on('end', function () {
      return callback(res, body);
    });
  }).on('error', function (err) {
    throw err;
  }).end();
};

