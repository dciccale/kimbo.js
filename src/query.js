var r_id = /^#([\w\-]+)$/,
  r_class = /^\.([\w\-]+)$/,
  r_tag = /^[\w\-]+$/,
  r_name = /^\[name=["']?([\w\-]+)["']?\]$/;

// use querySelectoAll but optimize for id, class, tagName and name
// much, much faster than only using querySelectorAll
function query(element, selector) {
  var els = [];

  // #id
  if (element === document && r_id.test(selector)) {
    els = element.getElementById(selector.replace(/#/, ''));
  }

  // .class
  if (r_class.test(selector)) {
    els = element.getElementsByClassName(selector.replace(/\./, ''));

  // tag
  } else if (r_tag.test(selector)) {
    els = element.getElementsByTagName(selector);

  // [name=val]
  } else if (r_name.test(selector)) {
    els = element.getElementsByName(selector.match(r_name)[1]);

  // css selector
  } else {
    els = element.querySelectorAll(selector);
  }

  // return node or NodeList as an array
  return slice.call(els);
}

// DOM Level 4 contains
function _contains(el1, el2) {
  return (el1 === window && (el2 && (el2 === window || el2.nodeType))) || ((el1 && el1.nodeType) && (el2 && el2.nodeType)) ? (el1.contains ? el1.contains(el2) : true) : false;
}
