/*jshint -W030 */
describe('manipulation', function () {
  var query = null;
  var el = null;
  var $li_first = null;
  var $li_second = null;
  var $input = null;
  var fixture = spec.getFixture();

  function getClass(el) {
    return el[0].className.trim().split(/\s+/);
  }

  beforeEach(function () {
    el = fixture.cloneNode(true);
    document.body.appendChild(el);

    $li_first = $('li.first');
    $li_second = $('li#second');
    $input = $('#name');
    query = Kimbo.require('query');
  });

  afterEach(function () {
    el.parentNode.removeChild(el);
    el = null;
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
      expect($li_first.text()).to.equal('uno');
    });

    it('should set the textContent of an element', function () {
      $li_first.text('one');
      expect($li_first.text()).to.equal('one');
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
      expect($li_second.html()).to.equal(html);
    });

    it('should set the innerHTML of an element', function () {
      var content;
      content = '<span>dos</span>';
      $li_second.html(content);
      expect($li_second.html()).to.equal(content);
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
      $li_first.addClass('uno');
      expect(getClass($li_first)).to.deep.equal(['first', 'active', 'uno']);
    });

    it('should only add a class if the nodeType is 1 (ELEMENT_NODE)', function () {
      var textNode;
      textNode = $($li_first[0].firstChild);
      expect(textNode.addClass('text_node')).to.equal(textNode);
    });

    it('should add multiple classes to an element', function () {
      $li_second.addClass('dos two due');
      expect(getClass($li_second)).to.deep.equal(['dos', 'two', 'due']);
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
        $li_second.addClass();
      }).to.not.throw();

      expect(function () {
        $li_second.addClass('');
      }).to.not.throw();

      expect(function () {
        $li_second.addClass(null);
      }).to.not.throw();

      expect(function () {
        $li_second.addClass(true);
      }).to.not.throw();

      expect(function () {
        $li_second.addClass([]);
      }).to.not.throw();

      expect(function () {
        $li_second.addClass({});
      }).to.not.throw();
    });

    it('should do nothing when called with wierd or without arguments', function () {
      var currentClasses = getClass($li_first);
      $li_first.addClass();
      expect(getClass($li_first)).to.deep.equal(currentClasses);
      $li_first.addClass('');
      expect(getClass($li_first)).to.deep.equal(currentClasses);
      $li_first.addClass(null);
      expect(getClass($li_first)).to.deep.equal(currentClasses);
      $li_first.addClass(true);
      expect(getClass($li_first)).to.deep.equal(currentClasses);
      $li_first.addClass([]);
      expect(getClass($li_first)).to.deep.equal(currentClasses);
      $li_first.addClass({});
    });
  });

  describe('removeClass()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').removeClass('noexists');
      }).to.not.throw();
    });

    it('should remove a class from an element', function () {
      $li_first.removeClass('uno');
      expect(getClass($li_first)).to.deep.equal(['first', 'active']);
    });

    it('should only add a class if the nodeType is 1 (ELEMENT_NODE)', function () {
      var textNode;
      textNode = $($li_first[0].firstChild);
      expect(textNode.removeClass('text_node')).to.equal(textNode);
    });

    it('should remove multiple classes from an element', function () {
      $li_second[0].className = 'dos due';
      $li_second.removeClass('dos due');
      expect(getClass($li_second)).to.deep.equal(['']);
    });

    it('should remove all classes from an element if called without arguments', function () {
      $li_second[0].className = 'test multiple';
      $li_second.removeClass();
      expect(getClass($li_second)).to.deep.equal(['']);
      $li_second[0].className = 'test multiple';
      $li_second.removeClass('');
      expect(getClass($li_second)).to.deep.equal(['']);
    });

    it('should not fail when called with wierd arguments', function () {
      expect(function () {
        $li_second.removeClass(null);
      }).to.not.throw();
      expect(function () {
        $li_second.removeClass(true);
      }).to.not.throw();
      expect(function () {
        $li_second.removeClass([]);
      }).to.not.throw();
      expect(function () {
        $li_second.removeClass({});
      }).to.not.throw();
    });

    it('should do nothing when called with wierd arguments', function () {
      var currentClasses = getClass($li_first);
      $li_first.removeClass([]);
      expect(getClass($li_first)).to.deep.equal(currentClasses);
      $li_first.removeClass({});
      expect(getClass($li_first)).to.deep.equal(currentClasses);
    });

    it('should remove all clases from an element when falsy values passed', function () {
      $li_second[0].className = 'has multiple classes';
      $li_second.removeClass(false);
      expect(getClass($li_second)).to.deep.equal(['']);
      $li_second[0].className = 'has multiple classes';
      $li_second.removeClass(null);
      expect(getClass($li_second)).to.deep.equal(['']);
      $li_second[0].className = 'has multiple classes';
      $li_second.removeClass(0);
      expect(getClass($li_second)).to.deep.equal(['']);
    });
  });

  describe('hasClass()', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').hasClass();
      }).to.not.throw();
    });

    it('should return whether an element has the specified class', function () {
      expect($li_first.hasClass('first')).to.be.true;
      expect($li_first.hasClass('second')).to.be.false;
    });

    it('should return whether multiple elements has the specified class', function () {
      var $lis;
      $lis = $('#list li').addClass('li');
      expect($lis.hasClass('li')).to.be.true;
      expect($lis.hasClass('first')).to.be.false;
      $lis.removeClass('li');
    });

    it('should return false when weird or no arguments are passed', function () {
      expect($li_first.hasClass()).to.be.false;
      expect($li_first.hasClass('')).to.be.false;
      expect($li_first.hasClass(true)).to.be.false;
      expect($li_first.hasClass(false)).to.be.false;
      expect($li_first.hasClass([])).to.be.false;
      expect($li_first.hasClass({})).to.be.false;
    });
  });

  describe('toggleClass', function () {
    it('should not fail when called on an empty set', function () {
      expect(function () {
        $('#noexists').toggleClass();
      }).to.not.throw();
    });

    it('should add the class if the element has not that class', function () {
      $li_second.toggleClass('toggle');
      expect(getClass($li_second)).to.deep.equal(['toggle']);
    });

    it('should remove the class if the element has that class', function () {
      $li_second[0].className = 'toggle';
      $li_second.toggleClass('toggle');
      expect(getClass($li_second)).to.deep.equal(['']);
    });

    it('should add toggle multiple classes', function () {
      $li_second.toggleClass('toggle toggle2 toggle3');
      expect(getClass($li_second)).to.deep.equal(['toggle', 'toggle2', 'toggle3']);
    });

    it('should remove toggle multiple classes', function () {
      $li_second[0].className = 'toggle toggle2 toggle3';
      $li_second.toggleClass('toggle toggle2 toggle3');
      expect(getClass($li_second)).to.deep.equal(['']);
    });

    it('should accept a bool second parameter indicating wather to add or remove a class', function () {
      $li_second.toggleClass('toggle', false);
      expect(getClass($li_second)).to.deep.equal(['']);
    });
  });

});
