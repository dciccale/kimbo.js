/*jshint -W030 */
describe('query', function () {
  'use strict';

  var el = null;
  var query = null;
  var fixture = spec.getFixture();

  beforeEach(function () {
    el = fixture.cloneNode(true);
    query = Kimbo.require('query');
    document.body.appendChild(el);
  });

  afterEach(function () {
    el.parentNode.removeChild(el);
    el = null;
    query = null;
  });

  it('should support ID selector', function () {
    var $el = $(document).find('#list');
    expect($el.length).to.equal(1);
  });

  it('should support class selector', function () {
    var $el = $('.active');
    expect($el.length).to.equal(1);
  });

  it('should support tag selector', function () {
    var $el = $('section');
    expect($el.length).to.equal(1);
  });

  it('should support name selector', function () {
    var $el = $('[name="name"]');
    expect($el.length).to.equal(1);
  });

  it('should support a complex selector', function () {
    var $el = $('#list > li:nth-child(2)');
    expect($el.length).to.equal(1);
  });

  it('should return multiple results', function () {
    var $el = $('#list li');
    expect($el.length).to.equal(3);
  });

  it('should return empty set when no match found', function () {
    var $el = $('#noexists');
    expect($el.length).to.equal(0);
  });

  it('should have a method contains', function () {
    expect(typeof query.contains === 'function').to.be.true;
  });

  it('should correctly return a boolean if element is contained in another', function () {
    expect(query.contains(window, window)).to.be.true;
    expect(query.contains(window, document)).to.be.true;
    expect(query.contains(document, document.body)).to.be.true;
    expect(query.contains(document, window)).to.be.false;
    expect(query.contains(null, null)).to.be.false;
  });
});
