/*jshint -W030 */
describe('manipulation', function () {
  'use strict';

  var query = null;
  var el = null;
  var $liFirst = null;
  var $liSecond = null;
  var $input = null;
  var fixture = spec.getFixture();

  function getClass(el) {
    return el[0].className.trim().split(/\s+/);
  }

  beforeEach(function () {
    el = fixture.cloneNode(true);
    document.body.appendChild(el);

    $liFirst = $('li.first');
    $liSecond = $('li#second');
    $input = $('#name');
    query = Kimbo.require('query');
  });

  afterEach(function () {
    el.parentNode.removeChild(el);
    el = null;
    $liFirst = null;
    $liSecond = null;
    $input = null;
    query = null;
  });

  describe('text()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').text();
      }).to.not.throw();
    });

    it('should return undefined for a non existing element', function () {
      expect($('#noexists').text()).to.equal(void 0);
    });

    it('should return the textContent of an element', function () {
      expect($liFirst.text()).to.equal('uno');
    });

    it('should set the textContent of an element', function () {
      $liFirst.text('one');
      expect($liFirst.text()).to.equal('one');
    });
  });

  describe('html()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').html();
      }).to.not.throw();
    });

    it('should return undefined for a non existing element', function () {
      expect($('#noexists').html()).to.equal(void 0);
    });

    it('should return the innerHTML of an element', function () {
      var html;
      html = document.getElementById('second').innerHTML;
      expect($liSecond.html()).to.equal(html);
    });

    it('should set the innerHTML of an element', function () {
      var content;
      content = '<span>dos</span>';
      $liSecond.html(content);
      expect($liSecond.html()).to.equal(content);
    });

  });

  describe('val()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').val();
      }).to.not.throw();
    });

    it('should return undefined for a non existing element', function () {
      expect($('#noexists').val()).to.equal(void 0);
    });

    it('should return the value of an element', function () {
      var value;
      value = document.getElementById('name').value;
      expect($input.val()).to.equal(value);
    });

    it('should set the value of an element', function () {
      var content;
      content = 'changed';
      $input.val(content);
      expect($input[0].value).to.equal(content);
    });
  });

  describe('addClass()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').addClass('noexists');
      }).to.not.throw();
    });

    it('should add a class to an element', function () {
      $liFirst.addClass('uno');
      expect(getClass($liFirst)).to.deep.equal(['first', 'active', 'uno']);
    });

    it('should only add a class if the nodeType is 1 (ELEMENT_NODE)', function () {
      var textNode;
      textNode = $($liFirst[0].firstChild);
      expect(textNode.addClass('text_node')).to.equal(textNode);
    });

    it('should add multiple classes to an element', function () {
      $liSecond.addClass('dos two due');
      expect(getClass($liSecond)).to.deep.equal(['dos', 'two', 'due']);
    });

    it('should add multiple classes to multiple elements', function () {
      var $lis;
      $lis = $('#list2 li').addClass('li mm');
      expect($lis[0].className).to.equal('li mm');
      expect($lis[1].className).to.equal('li mm');
      expect($lis[2].className).to.equal('li mm');
    });

    it('should not fail when called with weird or without arguments', function () {
      expect(function () {
        $liSecond.addClass();
      }).to.not.throw();

      expect(function () {
        $liSecond.addClass('');
      }).to.not.throw();

      expect(function () {
        $liSecond.addClass(null);
      }).to.not.throw();

      expect(function () {
        $liSecond.addClass(true);
      }).to.not.throw();

      expect(function () {
        $liSecond.addClass([]);
      }).to.not.throw();

      expect(function () {
        $liSecond.addClass({});
      }).to.not.throw();
    });

    it('should do nothing when called with wierd or without arguments', function () {
      var currentClasses = getClass($liFirst);
      $liFirst.addClass();
      expect(getClass($liFirst)).to.deep.equal(currentClasses);
      $liFirst.addClass('');
      expect(getClass($liFirst)).to.deep.equal(currentClasses);
      $liFirst.addClass(null);
      expect(getClass($liFirst)).to.deep.equal(currentClasses);
      $liFirst.addClass(true);
      expect(getClass($liFirst)).to.deep.equal(currentClasses);
      $liFirst.addClass([]);
      expect(getClass($liFirst)).to.deep.equal(currentClasses);
      $liFirst.addClass({});
    });
  });

  describe('removeClass()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').removeClass('noexists');
      }).to.not.throw();
    });

    it('should remove a class from an element', function () {
      $liFirst.removeClass('uno');
      expect(getClass($liFirst)).to.deep.equal(['first', 'active']);
    });

    it('should only add a class if the nodeType is 1 (ELEMENT_NODE)', function () {
      var textNode;
      textNode = $($liFirst[0].firstChild);
      expect(textNode.removeClass('text_node')).to.equal(textNode);
    });

    it('should remove multiple classes from an element', function () {
      $liSecond[0].className = 'dos due';
      $liSecond.removeClass('dos due');
      expect(getClass($liSecond)).to.deep.equal(['']);
    });

    it('should remove all classes from an element if called without arguments', function () {
      $liSecond[0].className = 'test multiple';
      $liSecond.removeClass();
      expect(getClass($liSecond)).to.deep.equal(['']);
      $liSecond[0].className = 'test multiple';
      $liSecond.removeClass('');
      expect(getClass($liSecond)).to.deep.equal(['']);
    });

    it('should not fail when called with wierd arguments', function () {
      expect(function () {
        $liSecond.removeClass(null);
      }).to.not.throw();
      expect(function () {
        $liSecond.removeClass(true);
      }).to.not.throw();
      expect(function () {
        $liSecond.removeClass([]);
      }).to.not.throw();
      expect(function () {
        $liSecond.removeClass({});
      }).to.not.throw();
    });

    it('should do nothing when called with wierd arguments', function () {
      var currentClasses = getClass($liFirst);
      $liFirst.removeClass([]);
      expect(getClass($liFirst)).to.deep.equal(currentClasses);
      $liFirst.removeClass({});
      expect(getClass($liFirst)).to.deep.equal(currentClasses);
    });

    it('should remove all clases from an element when falsy values passed', function () {
      $liSecond[0].className = 'has multiple classes';
      $liSecond.removeClass(false);
      expect(getClass($liSecond)).to.deep.equal(['']);
      $liSecond[0].className = 'has multiple classes';
      $liSecond.removeClass(null);
      expect(getClass($liSecond)).to.deep.equal(['']);
      $liSecond[0].className = 'has multiple classes';
      $liSecond.removeClass(0);
      expect(getClass($liSecond)).to.deep.equal(['']);
    });
  });

  describe('hasClass()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').hasClass();
      }).to.not.throw();
    });

    it('should return whether an element has the specified class', function () {
      expect($liFirst.hasClass('first')).to.be.true;
      expect($liFirst.hasClass('second')).to.be.false;
    });

    it('should return whether multiple elements has the specified class', function () {
      var $lis;
      $lis = $('#list li').addClass('li');
      expect($lis.hasClass('li')).to.be.true;
      expect($lis.hasClass('first')).to.be.false;
      $lis.removeClass('li');
    });

    it('should return false when weird or no arguments are passed', function () {
      expect($liFirst.hasClass()).to.be.false;
      expect($liFirst.hasClass('')).to.be.false;
      expect($liFirst.hasClass(true)).to.be.false;
      expect($liFirst.hasClass(false)).to.be.false;
      expect($liFirst.hasClass([])).to.be.false;
      expect($liFirst.hasClass({})).to.be.false;
    });
  });

  describe('toggleClass', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').toggleClass();
      }).to.not.throw();
    });

    it('should add the class if the element has not that class', function () {
      $liSecond.toggleClass('toggle');
      expect(getClass($liSecond)).to.deep.equal(['toggle']);
    });

    it('should remove the class if the element has that class', function () {
      $liSecond[0].className = 'toggle';
      $liSecond.toggleClass('toggle');
      expect(getClass($liSecond)).to.deep.equal(['']);
    });

    it('should add toggle multiple classes', function () {
      $liSecond.toggleClass('toggle toggle2 toggle3');
      expect(getClass($liSecond)).to.deep.equal(['toggle', 'toggle2', 'toggle3']);
    });

    it('should remove toggle multiple classes', function () {
      $liSecond[0].className = 'toggle toggle2 toggle3';
      $liSecond.toggleClass('toggle toggle2 toggle3');
      expect(getClass($liSecond)).to.deep.equal(['']);
    });

    it('should accept a bool second parameter indicating wather to add or remove a class', function () {
      $liSecond.toggleClass('toggle', false);
      expect(getClass($liSecond)).to.deep.equal(['']);
    });
  });

});
