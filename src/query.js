Kimbo.define('query', function (_) {

  'use strict';

  // Selector regexes
  var ID_RE = /^#([\w\-]+)$/;
  var CLASS_RE = /^\.([\w\-]+)$/;
  var TAG_RE = /^[\w\-]+$/;
  var NAME_RE = /^\[name=["']?([\w\-]+)["']?\]$/;

  // Use querySelectoAll but optimize for id, class, tagName and name
  var _find = function (element, selector) {
    var els = [], sel;

    // #id
    if (element === _.document && (sel = ID_RE.exec(selector))) {
      els = element.getElementById(sel[1]);

    // .class
    } else if ((sel = CLASS_RE.exec(selector))) {
      els = element.getElementsByClassName(sel[1]);

    // tag
    } else if (TAG_RE.test(selector)) {
      els = element.getElementsByTagName(selector);

    // [name=val]
    } else if ((sel = NAME_RE.exec(selector))) {
      els = element.getElementsByName(sel[1]);

    // Other CSS selectors
    } else {
      els = element.querySelectorAll(selector);
    }

    // Return NodeList/Node as an array
    return _.slice.call(els);
  };

  // DOM Level 4 contains improved
  var _contains = function (el1, el2) {
    return (el1 === window && (el2 && (el2 === window || el2.nodeType))) ||
      ((el1 && el1.nodeType) &&
     (el2 && el2.nodeType)) ? (el1.contains ? el1.contains(el2) : true) : false;
  };

  return {
    find: _find,
    contains: _contains
  };
});
