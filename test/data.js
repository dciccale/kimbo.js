describe('data', function () {
  'use strict';

  var $el = null;

  beforeEach(function () {
    $el = $(document.createElement('div'));
    $el.removeData();
  });

  afterEach(function () {
    $el = null;
  });

  describe('data()', function () {
    it('should store data in elements', function () {
      expect($el.data('key')).to.equal(void 0);
      $el.data('key', 'value');
      expect($el.data('key')).to.equal('value');
    });

    it('should get data from element dataset', function () {
      $el[0].dataset.key = 'value';
      expect($el.data('key')).to.equal('value');
    });

    it('should return this if trying to operate on an empty set', function () {
      var $empty = $([]);
      expect($empty.data('key', 'value')).to.deep.equal($empty);
    });
  });

  describe('removeData()', function () {
    it('should remove data from an element', function () {
      expect($el.data('key')).to.equal(void 0);
      $el.data('key', 'value');
      expect($el.data('key')).to.equal('value');
      $el.removeData('key');
      expect($el.data('key')).to.equal(void 0);
    });

    it('should return this if trying to operate on an empty set', function () {
      var $empty = $([]);
      expect($empty.removeData('key')).to.deep.equal($empty);
    });

    it('should remove all data if called without key', function () {
      $el.data('k1', 'v1');
      $el.data('k2', 'v2');
      expect($el.data('k1')).to.equal('v1');
      expect($el.data('k2')).to.equal('v2');
      $el.removeData();
      expect($el.data('k1')).to.equal(void 0);
      expect($el.data('k2')).to.equal(void 0);
    });
  });
});
