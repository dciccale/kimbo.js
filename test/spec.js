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

    onDOMLoaded: (function () {
      var cb = null;
      document.addEventListener('DOMContentLoaded', function () {
        if (cb) {
          cb();
        }
      });

      return function (callback) {
        cb = callback;
        var ev = document.createEvent('UIEvents');
        ev.initUIEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(ev);
      };
    }()),

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
