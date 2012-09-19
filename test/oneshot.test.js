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

test('redirecting server', function (t) {
  var opts = {
    body: 'x',
    redirect: '/where',
  };
  oneshot(opts, function (server, urlopts) {
    server.get(function (response, body) {
      var headers = response.headers;
      var location = headers['location'];
      t.same(location, opts.redirect);
      urlopts.pathname = location;
      oneshot.get(urlopts, function (response, body) {
        t.same(body, opts.body);
        t.end();
      })
    });
  })
});

test('multirequest', function (t) {
  var opts = {
    body: 'x',
    requests: 2
  };
  oneshot(opts, function (server) {
    server.get(function (response, body) {
      t.same(opts.requests, 1, 'one less response');
      server.get(function (response, body) {
        t.same(opts.requests, 0, 'zero responses');
        t.end();
      });
    });
  });
});

test('statuscode', function (t) {
  var opts = { body: 'x', statusCode: 420 };
  oneshot(opts, function (server) {
    server.get(function (response, body) {
      t.same(response.statusCode, opts.statusCode);
      t.end();
    });
  });
});
