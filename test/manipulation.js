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

  describe('prepend()', function () {
    it('should be defined', function () {
      expect($.fn.prepend).to.be.defined;
    });

    it('should insert content to the begining of elements in the collection', function () {
      var $ul = $('#list');
      $ul.prepend('<li>prepended</li>');
      expect($ul.children()[0].textContent).to.equal('prepended');
    });

    it('should return on empty set', function () {
      var $ul = $('#noexists');
      $ul.prepend('<li>prepended</li>');
      expect($ul.length).to.equal(0);
      expect($ul).to.be.instanceof(Kimbo);
    });
  });

  describe('append()', function () {
    it('should be defined', function () {
      expect($.fn.append).to.be.defined;
    });

    it('should insert content to the begining of elements in the collection', function () {
      var $ul = $('#list');
      $ul.append('<li>appended</li>');
      expect($ul.children().last()[0].textContent).to.equal('appended');
    });

    it('should return on empty set', function () {
      var $ul = $('#noexists');
      $ul.append('<li>appended</li>');
      expect($ul.length).to.equal(0);
      expect($ul).to.be.instanceof(Kimbo);
    });
  });

  describe('empty()', function () {
    it('should be defined', function () {
      expect($.fn.empty).to.be.defined;
    });

    it('should remove all child elements', function () {
      var $ul = $('#list');
      expect($ul.children().length).to.equal(3);
      $ul.empty();
      expect($ul.children().length).to.equal(0);
    });

    it('should return on empty set', function () {
      var $ul = $('#noexists');
      $ul.empty();
      expect($ul.length).to.equal(0);
      expect($ul).to.be.instanceof(Kimbo);
    });
  });

  describe('remove()', function () {
    it('should be defined', function () {
      expect($.fn.remove).to.be.defined;
    });

    it('should remove the matched element from the dom', function () {
      var $ul = $('#list');
      expect($ul.length).to.equal(1);
      $ul.remove();
      expect($('#list').length).to.equal(0);
    });

    it('should return on remove set', function () {
      var $ul = $('#noexists');
      $ul.remove();
      expect($ul.length).to.equal(0);
      expect($ul).to.be.instanceof(Kimbo);
    });
  });

  describe('attr()', function () {
    it('should be defined', function () {
      expect($.fn.attr).to.be.defined;
    });

    it('should get an attribute from a dom element', function () {
      expect($liFirst.attr('class')).to.equal('first active');
    });

    it('should set an attribute to a dom element', function () {
      $liFirst.attr('data-test', 'yes');
      expect($liFirst.attr('data-test')).to.equal('yes');
    });

    it('should set boolean attributes to true', function () {
      $input.attr('disabled', true);
      expect($input.attr('disabled')).to.equal('disabled');
    });

    it('should set boolean attributes to false', function () {
      $input.attr('disabled', false);
      expect($input.attr('disabled')).to.equal(void 0);
    });

    it('should return on empty set', function () {
      var ret = $('#noexists').attr('data-fun', 'yes');
      expect(ret.length).to.equal(0);
      expect(ret).to.be.instanceof(Kimbo);
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

  describe('clone()', function () {
    it('should be defined', function () {
      expect($.fn.clone).to.be.defined;
    });

    it('should recursively clone a dom element', function () {
      var $ul = $('#list');
      var $cloned = $ul.clone();
      expect($ul.children().length).to.equal(3);
      expect($cloned.children().length).to.equal(3);
      expect($ul.children('#second').length).to.equal(1);
      expect($cloned.children('#second').length).to.equal(1);
    });
  });
});
