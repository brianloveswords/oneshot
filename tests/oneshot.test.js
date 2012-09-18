var oneshot = require('../');
var test = require('tap').test;
var http = require('http');

function get(opts, callback) {
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
}

test('serve one thing once', function (t) {
  var serveBody = 'what';
  oneshot({body: serveBody}, function (server, opts) {
    get(opts, function (response, body) {
      t.same(body, serveBody);
      t.end();
    });
  });
});

test('serve one thing with specific mimetype', function (t) {
  var expect = 'application/javascript';
  var opts = {body: 'x', type: expect};
  oneshot(opts, function (server, urlopts) {
    get(urlopts, function (response, body) {
      var type = response.headers['content-type'];
      t.same(expect, type, 'should get right type back');
      t.end();
    });
  });
});
