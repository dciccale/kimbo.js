var r_id = /^#([\w\-]+)$/,
  r_class = /^\.([\w\-]+)$/,
  r_tag = /^[\w\-]+$/,
  r_name = /^\[name=["']?([\w\-]+)["']?\]$/;


// use querySelectoAll but optimize for id, class, tagName and name
// much, much faster than only using querySelectorAll
function _query(element, selector) {
  var els = [], sel;

  // #id
  if (element === document && (sel = r_id.exec(selector))) {
    els = element.getElementById(sel[1]);

  // .class
  } else if ((sel = r_class.exec(selector))) {
    els = element.getElementsByClassName(sel[1]);

  // tag
  } else if (r_tag.test(selector)) {
    els = element.getElementsByTagName(selector);

  // [name=val]
  } else if ((sel = r_name.exec(selector))) {
    els = element.getElementsByName(sel[1]);

  // any other css selector
  } else {
    els = element.querySelectorAll(selector);
  }

  // return NodeList/Node as an array
  return slice.call(els);
}

// DOM Level 4 contains
function _contains(el1, el2) {
  return (el1 === window && (el2 && (el2 === window || el2.nodeType))) || ((el1 && el1.nodeType) && (el2 && el2.nodeType)) ? (el1.contains ? el1.contains(el2) : true) : false;
}
