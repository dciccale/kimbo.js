/*jshint -W030 */
describe('event', function () {
  'use strict';

  var el = null;
  spec.fixture.init();

  beforeEach(function () {
    el = spec.fixture.get();
    document.body.appendChild(el);
  });

  afterEach(function () {
    spec.fixture.restore(el);
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

    it('should not add register listener if no callback passed', function () {
      var $li = $('#second');
      $li.on('click');
    });

    it('should handle preventDefault()', function () {
      var $ul = $('#list');
      var $li = $('#second');
      $li.on('click', function (ev) {
        ev.preventDefault();
      });
      $ul.on('click', function (ev) {
        expect(ev.isDefaultPrevented()).to.be.true;
      });
      spec.trigger($li[0], 'click');
    });

    it('should handle stopPropagation()', function () {
      var $ul = $('#list');
      var $li = $('#second');
      var cb = sinon.spy();
      $li.on('click', function (ev) {
        ev.stopPropagation();
      });
      $ul.on('click', cb);
      spec.trigger($li[0], 'click');
      expect(cb.called).to.be.false;
    });

    it('should handle stopImmediatePropagation()', function () {
      var $li = $('#second');
      var lastClick = 'click1';
      $li.on('click', function (ev) {
        ev.stopImmediatePropagation();
      });
      $li.on('click', function () {
        lastClick = 'click2';
      });
      spec.trigger($li[0], 'click');
      expect(lastClick).to.equal('click1');
    });

    it('should support mouseover/mouseenter and mouseout/mouseleave', function () {
      var $li = $('#second');
      var over = sinon.spy();
      var out = sinon.spy();
      var enter = sinon.spy();
      var leave = sinon.spy();

      $li
        .on('mouseover', over)
        .on('mouseout', out)
        .on('mouseenter', enter)
        .on('mouseleave', leave);

      $li.trigger('mouseover');
      $li.trigger('mouseout');
      $li.trigger('mouseenter');
      $li.trigger('mouseleave');

      expect(over.called).to.be.true;
      expect(out.called).to.be.true;

      expect(enter.called).to.be.true;
      expect(leave.called).to.be.true;
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

    it('should remove all handlers if no event type provided', function () {
      var $li = $('#second');
      var cb = sinon.spy();
      var cb2 = sinon.spy();

      $li.on('click', cb);
      $li.on('dblclick', cb2);

      spec.trigger($li[0], 'click');
      spec.trigger($li[0], 'dblclick');
      expect(cb.called).to.be.true;
      expect(cb2.called).to.be.true;

      cb.called = false;
      cb2.called = false;

      $li.off();
      spec.trigger($li[0], 'click');
      spec.trigger($li[0], 'dblclick');
      expect(cb.called).to.be.false;
      expect(cb2.called).to.be.false;
    });

    it('should remove delegated events by selector', function () {
      var $ul = $('#list');
      var cb = sinon.spy();
      var li = $ul.find('li')[0];
      $ul.on('click', 'li', cb);
      spec.trigger(li, 'click');
      expect(cb.called).to.be.true;

      cb.called = false;
      $ul.off('click', 'li');
      spec.trigger(li, 'click');
      expect(cb.called).to.be.false;
    });

    it('should not remove handlers if selector doesn\'t match', function () {
      var $li = $('#second');
      var cb = sinon.spy();

      $li.on('click', cb);

      spec.trigger($li[0], 'click');

      cb.called = false;

      $li.off('click', 'ul');
      spec.trigger($li[0], 'click');
      expect(cb.called).to.be.true;
    });

    it('should not try to remove an event handlers if the element has none for specified event type', function () {
      $('#second').off('click');
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

    it('should not trigger on text nodes', function () {
      var $t = $(document.createTextNode('test'));
      var cb = sinon.spy();
      $t.on('click', cb);
      $t.trigger('click');
      spec.trigger($t[0], 'click');
      expect(cb.called).to.be.false;
    });

    it('should trigger native focus/blur', function () {
      var input = document.createElement('input');
      document.body.appendChild(input);
      $(input).trigger('focus');
      expect(input === input.ownerDocument.activeElement).to.be.true;
      $(input).trigger('blur');
      expect(input === input.ownerDocument.activeElement).to.be.false;
    });

    it('should stop event bubbling if callback returns false', function () {
      function callback() {
        return false;
      }
      function callback2(ev) {
        expect(ev.isDefaultPrevented()).to.be.true;
        expect(ev.isPropagationStopped()).to.be.true;
      }

      var $li = $('#second');
      var cb = sinon.spy(callback);
      var cb2 = sinon.spy(callback2);

      $li.on('click', cb);
      $li.on('click', cb2);

      spec.trigger($li[0], 'click');
      spec.trigger($li[0], 'click');
      expect(cb.called).to.be.true;
      expect(cb2.called).to.be.true;

      cb.called = false;
      cb2.called = false;

      $li.trigger('click');
      expect(cb.called).to.be.true;
      expect(cb2.called).to.be.true;
    });
  });
});
