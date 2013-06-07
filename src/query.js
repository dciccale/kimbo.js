Kimbo.define('query', function (_) {

  'use strict';

  var ID_RE = _.ID_RE = /^#([\w\-]+)$/;
  var CLASS_RE = /^\.([\w\-]+)$/;
  var TAG_RE = /^[\w\-]+$/;
  var NAME_RE = /^\[name=["']?([\w\-]+)["']?\]$/;

  // use querySelectoAll but optimize for id, class, tagName and name
  // much, much faster than only using querySelectorAll
  function _find(element, selector) {
    var els = [], sel;

    // #id
    if (element === document && (sel = ID_RE.exec(selector))) {
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

    // any other css selector
    } else {
      els = element.querySelectorAll(selector);
    }

    // return NodeList/Node as an array
    return _.slice.call(els);
  }

  // a better DOM Level 4 contains
  // http://webdecs.wordpress.com/2012/08/05/mejorando-el-metodo-contains-dom4-javascript/
  function _contains(el1, el2) {
    return (el1 === window && (el2 && (el2 === window || el2.nodeType))) || ((el1 && el1.nodeType) && (el2 && el2.nodeType)) ? (el1.contains ? el1.contains(el2) : true) : false;
  }

  return {
    find: _find,
    contains: _contains
  };
});
