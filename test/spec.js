(function (window) {
  'use strict';

  var document = window.document;

  var spec = {
    isPhantomJS: /PhantomJS/i.test(window.navigator.userAgent),

    getFixture: function () {
      var div = document.createElement('div');
      var fixture;
      if (this.isPhantomJS) {
        div.innerHTML = window.__html__['test/fixtures/fixture.html'];
      } else {
        fixture = document.getElementById('fixture');
        div.innerHTML = fixture.innerHTML.trim();
      }
      return div.firstChild;
    }
  };

  window.spec = spec;

}(window));
