/*jshint -W030 */
describe('css', function () {
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

  describe('show()', function () {
    it('should show a hidden element', function () {
      var $list = $('#list');
      $list[0].style.display = 'none';
      expect($list[0].style.display).to.equal('none');
      $list.show();
      expect($list[0].style.display).to.equal('block');
    });

    it('should successfuly get default display even if cluttered by a css property', function () {
      var css = 'input {display: none !important;}';
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
      var $input = $('#name');
      $input.show();
      expect($input[0].style.display).to.equal('inline-block');
      style.parentNode.removeChild(style);
    });
  });

  describe('hide()', function () {
    it('should be defined', function () {
      expect($.fn.hide).to.be.defined;
    });

    it('should hide an element', function () {
      var $section = $('section');
      $section.hide();
      expect($section[0].style.display).to.equal('none');
      // use cached display information when hiding more times
      $section.show().hide();
      expect($section[0].style.display).to.equal('none');
    });
  });

  describe('css()', function () {
    it('should be defined', function () {
      expect($.fn.css).to.be.defined;
    });

    it('should return if no valid arguments passed', function () {
      var $active = $('.active');
      expect($active.css()).to.be.instanceof($);
    });

    it('should apply styles', function () {
      var $active = $('.active');
      $active.css('color', 'red');
      expect($active[0].style.color).to.equal('red');
    });

    it('should get styles', function () {
      var $active = $('.active');
      $active.css('color', 'rgb(255, 0, 0)');
      expect($active.css('color')).to.equal('rgb(255, 0, 0)');
    });

    it('should append px for numbers', function () {
      var $active = $('.active');
      $active.css('height', 10);
      expect($active.css('height')).to.equal('10px');
    });

    it('should allow applying an object of properties', function () {
      var $active = $('.active');
      $active.css({
        height: 10,
        width: 20,
        fontSize: '20px'
      });

      expect($active.css('height')).to.equal('10px');
      expect($active.css('width')).to.equal('20px');
      expect($active.css('font-size')).to.equal('20px');
    });
  });
});
