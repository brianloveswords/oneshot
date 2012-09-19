var oneshot = require('../');
var test = require('tap').test;
var http = require('http');

test('serve one thing once', function (t) {
  var serveBody = 'what';
  oneshot({body: serveBody}, function (server, opts) {
    server.get(function (response, body) {
      t.same(body, serveBody);
      t.end();
    });
  });
});

test('serve one thing with specific mimetype', function (t) {
  var expect = 'application/javascript';
  var opts = {body: 'x', type: expect};
  oneshot(opts, function (server) {
    server.get(function (response, body) {
      var type = response.headers['content-type'];
      t.same(expect, type, 'should get right type back');
      t.end();
    });
  });
});


test('serve with arbitrary headers', function (t) {
  var opts = {
    body: 'x',
    headers: {
      'Accept': 'your poor and hungry',
      'x-lol': 'wut',
    }
  };
  oneshot(opts, function (server) {
    server.get(function (response, body) {
      var headers = response.headers;
      t.same(headers['x-lol'], 'wut');
      t.same(headers['accept'], 'your poor and hungry');
      t.end();
    });
  })
});
