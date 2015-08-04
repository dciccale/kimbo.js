describe('data', function () {
  it('should store data in elements', function () {
    var $el = $(document.createElement('div'));
    expect($el.data('key')).to.equal(void 0);
    $el.data('key', 'value');
    expect($el.data('key')).to.equal('value');
  });
});
