/*jshint -W030 */
describe('ajax', function () {
  'use strict';

  var server = null;
  var xhr = null;
  var requests = null;

  beforeEach(function () {
    server = sinon.fakeServer.create();
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  afterEach(function () {
    server && server.restore();
    xhr && xhr.restore && xhr.restore();
  });

  describe('get()', function () {
    it('should be defined', function () {
      expect($.get).to.be.defined;
    });

    it('should make a GET request', function () {
      function callback(res) {
        expect(res).to.equal('test');
      }
      $.get('test.txt', callback);
      expect(requests.length).to.equal(1);

      requests[0].respond(200, {'Content-Type': 'test/html'}, 'test');
    });

    it('should detect 304 as success', function () {
      function callback(res) {
        expect(res).to.equal('304');
      }
      $.get('304.txt', callback);
      expect(requests.length).to.equal(1);

      requests[0].respond(304, {'Content-Type': 'test/html'}, '304');
    });

    it('should handle erros', function () {
      function callback(res, msg) {
        expect(res).to.equal('500');
        expect(msg).to.equal('Internal Server Error');
      }
      $.ajax({
        type: 'GET',
        url: '500.txt',
        error: callback
      });

      expect(requests.length).to.equal(1);

      requests[0].respond(500, {'Content-Type': 'test/html'}, '500');
    });

    it('should detect JSONP', function () {
      server.respondWith('GET', /\/test.json\?callback=.*/, [200, {'Content-Type': 'application/json'}, '{"test": "jsonp"}']);
      function callback(res) {
        expect(res.test).to.equal('jsonp');
      }
      $.get('test.json?callback=?', callback);
      server.respond();
    });
  });

  describe('post()', function () {
    it('should be defined', function () {
      expect($.post).to.be.defined;
    });

    it('should make a POST request', function () {
      function callback(res) {
        expect(res.name).to.equal('test');
      }
      $.post('/user', callback);
      expect(requests.length).to.equal(1);

      requests[0].respond(200, {'Content-Type': 'application/json'}, '{"name": "test"}');
    });
  });

  describe('getJSON()', function () {
    it('should be defined', function () {
      expect($.getJSON).to.be.defined;
    });

    it('should make a get request', function () {
      function callback(res) {
        expect(res).to.deep.equal({test: true});
      }
      $.getJSON('test.json', callback);
      expect(requests.length).to.equal(1);
      requests[0].respond(200, {'Content-Type': 'application/json'}, '{"test": true}');
    });
  });

  describe('param()', function () {
    it('should be defined', function () {
      expect(Kimbo.param).to.be.defined;
    });

    it('should serialize an object suitable for sending in a URL query', function () {
      var obj = {name: 'test', value: 'test val'};
      expect($.param(obj)).to.equal('name=test&value=test+val');
      expect($.param('')).to.equal('');
    });
  });
});
