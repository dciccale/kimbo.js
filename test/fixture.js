(function (window) {
  'use strict';

  var document = window.document;

  var IS_PHANTOMJS = /PhantomJS/i.test(window.navigator.userAgent);

  var fixture = {
    el: null,
    init: function () {
      var div = document.createElement('div');
      var fixture;
      if (this.el) {
        this.restore(this.el);
        this.el = null;
      }
      if (IS_PHANTOMJS) {
        div.innerHTML = window.__html__['test/fixtures/fixture.html'];
      } else {
        fixture = document.getElementById('fixture');
        div.innerHTML = fixture.innerHTML.trim();
      }
      this.el = div.firstChild;
    },

    get: function () {
      return this.el.cloneNode(true);
    },

    restore: function (el) {
      if (el) {
        $(el).off().removeData();
        var children = el.childNodes || [];
        for (var i = 0; i < children.length; i++) {
          this.restore($(children[i]));
        }
        $(el).remove();
      }
    }
  };

  window.spec.fixture = fixture;

}(window));
