(function (window) {
  'use strict';

  var document = window.document;

  var spec = {
    trigger: function (el, eventType) {
      var ev = document.createEvent('MouseEvents');
      ev.initMouseEvent(eventType, true, true);
      el.dispatchEvent(ev);
      return ev;
    },

    fakeamd: (function () {
      var module = null;
      window.define = function (name, deps, cb) {
        module = cb();
      };
      window.define.amd = true;

      return function () {
        return module;
      };
    }())
  };

  window.spec = spec;

}(window));
