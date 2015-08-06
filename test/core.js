/*jshint -W030 */
describe('core', function () {
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

  it('Kimbo should be defined', function () {
    expect(Kimbo).to.be.defined;
  });

  it('$ should be Kimbo', function () {
    expect($).to.equal(Kimbo);
  });

  it('can be called without arguments', function () {
    expect($() instanceof Kimbo).to.be.true;
  });

  it('can be called with null', function () {
    expect($(null) instanceof Kimbo).to.be.true;
  });

  it('can be called with undefined', function () {
    expect($(void 0) instanceof Kimbo).to.be.true;
  });

  it('can be called with empty array', function () {
    expect($([]) instanceof Kimbo).to.be.true;
  });

  it('can be called with empty object', function () {
    expect($({}) instanceof Kimbo).to.be.true;
  });

  it('can be called passing a NodeList', function () {
    var $obj = $(document.getElementsByTagName('body'));
    expect($obj instanceof Kimbo).to.be.true;
  });

  it('can be called passing a dom element', function () {
    var $obj = $(document.body);
    expect($obj instanceof Kimbo).to.be.true;
  });

  it('a DOM element in the collection should be an actual DOM node', function () {
    var $obj = $(document.body);
    expect($obj[0].nodeType).to.equal(1);
  });

  it('can be called passing a dom element context', function () {
    var $obj = $('body', document);
    expect($obj[0]).to.equal(document.body);
  });

  it('should create a DOM element from a string', function () {
    var $obj = $('<div>');
    expect($obj[0].nodeType).to.equal(1);
    expect($obj[0].nodeName.toLowerCase()).to.equal('div');
  });

  it('should receive a function to be executed when the DOM is ready', function () {
    var callback = sinon.spy();
    spec.onDOMLoaded(callback);
    expect(callback.called).to.be.true;
  });

  it('should receive a function to be executed if DOM is already loaded', function () {
    var callback = sinon.spy();
    $(callback);
    expect(callback.called).to.be.true;
  });

  it('should get the array of elements', function () {
    var $li = $('li');
    expect(Array.isArray($li.get())).to.be.true;
  });

  it('should if no elements in stack', function () {
    var $none = $('#none');
    expect($none.get()).to.be.undefined;
  });

  it('should get an element from the stack by index', function () {
    var $li = $('li');
    expect($li.get(0)).to.equal($li[0]);
  });

  it('should get an element from the stack by negative index', function () {
    var $li = $('li');
    expect($li.get(-1)).to.equal($li[$li.length - 1]);
  });

  describe('extend()', function () {
    it('should extend deep objects', function () {
      var obj1 = {
        address: {
          zip: 123,
          details: {
            street: 's',
            number: 3
          }
        }
      };
      var obj2 = {
        address: {
          details: {
            apartment: 23
          }
        }
      };

      var obj3 = $.extend(true, obj1, obj2);
      expect(obj3.address.details.apartment).to.equal(23);
      expect(obj3.address.details.street).to.equal('s');
    });
  });

  it('should export to amd', function () {
    expect(spec.fakeamd()).to.equal(Kimbo);
  });
});
