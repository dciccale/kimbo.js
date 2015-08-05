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

  describe('ajax()', function () {
    it('should be defined', function () {
      expect($.ajax).to.be.defined;
    });

    it('should make a request', function () {
      var cb = sinon.spy();
      $.ajax({
        type: 'GET',
        url: 'my/url',
        success: cb
      });

      expect(requests.length).to.equal(1);
      requests[0].respond(200, {'Content-Type': 'test/html'}, 'hello');
      expect(cb.called).to.be.true;
    });

    it('should allow sending data', function () {
      var cb = sinon.spy();
      $.ajax({
        type: 'POST',
        url: 'my/url',
        success: cb,
        data: {name: 'new'}
      });

      expect(requests.length).to.equal(1);
      requests[0].respond(200, {'Content-Type': 'test/html'}, 'hello');
      expect(cb.called).to.be.true;
    });

    it('should be able to define a custom timeout', function (done) {
      this.timeout(800);
      var cb = sinon.spy();

      server.respondWith(function (xhr) {
        xhr.respond(200, null, 'hello');
      });

      $.ajax({
        type: 'GET',
        url: 'my/url',
        success: cb,
        timeout: 500
      });

      server.respond();

      window.setTimeout(function () {
        expect(cb.called).to.be.false;
        done();
      } , 600);
    });
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

    it('should fail if json is not well formatted', function () {
      var cb = sinon.spy();
      $.ajax({
        type: 'GET',
        url: 'my/url',
        error: cb,
        dataType: 'json'
      });

      expect(requests.length).to.equal(1);
      requests[0].respond(200, {'Content-Type': 'application/json'}, '{"test: "asd"}');
      expect(cb.called).to.be.true;
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
