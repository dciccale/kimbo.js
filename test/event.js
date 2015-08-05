/*jshint -W030 */
describe('event', function () {
  'use strict';

  var el = null;
  var fixture = spec.getFixture();

  beforeEach(function () {
    el = fixture.cloneNode(true);
    document.body.appendChild(el);
  });

  afterEach(function () {
    el.parentNode.removeChild(el);
    el = null;
  });

  describe('on()', function () {
    it('should be defined', function () {
      expect($.fn.on).to.be.defined;
    });

    it('should add an event handler to selected elements', function () {
      var $li = $('#second');
      var cb = sinon.spy();
      $li.on('click', cb);
      spec.trigger($li[0], 'click');
      expect(cb.called).to.be.true;
    });

    it('should delegate event handler to selector', function () {
      var $ul = $('#list');
      var cb = sinon.spy();
      $ul.on('click', 'li', cb);
      spec.trigger($ul.children()[0], 'click');
      expect(cb.called).to.be.true;
    });

    it('should allow passing custom data', function () {
      var $li = $('#second');
      function callback(ev) {
        expect(ev.data.test).to.equal('yes');
      }
      var cb = sinon.spy(callback);
      $li.on('click', {test: 'yes'}, cb);
      spec.trigger($li[0], 'click');
      expect(cb.called).to.be.true;
    });
  });

  describe('off()', function () {
    it('should be defined', function () {
      expect($.fn.off).to.be.defined;
    });

    it('should remove event handlers from selected elements', function () {
      var $li = $('#second');
      var cb = sinon.spy();
      $li.on('click', cb);
      spec.trigger($li[0], 'click');
      expect(cb.called).to.be.true;
      cb.called = false;
      $li.off('click', cb);
      spec.trigger($li[0], 'click');
      expect(cb.called).to.be.false;
    });
  });

  describe('trigger()', function () {
    it('should be defined', function () {
      expect($.fn.trigger).to.be.defined;
    });

    it('should trigger the handler for the given event type', function () {
      var $li = $('#second');
      var cb = sinon.spy();
      $li.on('click', cb);
      $li.trigger('click');
      expect(cb.called).to.be.true;
    });
  });
});
