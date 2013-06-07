(function (window) {

  'use strict';

  /*\
   * $
   [ object ]
   * Global namespace for using Kimbo functions
  \*/

  var modules = {};
  var document = window.document;

  // common helper methods
  var _ = {
    push: Array.prototype.push,
    slice: Array.prototype.slice,
    rootContext: document,
    kimbo: function (element) {
      return new Kimbo(element);
    }
  };

  /*\
   * $(…)
   * Kimbo object collection.
   * All methods called from a Kimbo collection affects all elements in it.
  \*/
  function Kimbo(selector, context) {
    var elem, match;

    if (!Kimbo.isKimbo(this)) {
      return new Kimbo(selector, context);
    }

    // no selector, return empty Kimbo object
    if (!selector) {
      return this;
    }

    // asume a css selector, query the dom
    if (typeof selector === 'string') {

      match = _.ID_RE.exec(selector);

      // handle $('#id');
      if (match && match[1]) {
        elem = document.getElementById(match[1]);

        if (elem) {
          this[0] = elem;
          this.length = 1;
        }

        return this;
      }

      // if no context find it on document
      if (!context) {
        return _.rootContext.find(selector);

      // create new Kimbo object with the specified context
      } else if (context) {
        return _.kimbo(context).find(selector);
      }

    // already a dom element
    } else if (selector.nodeType) {
      this[0] = selector;
      this.length = 1;
      return this;

    // is a function, call it when DOM is ready
    } else if (Kimbo.isFunction(selector)) {
      return _.rootContext.ready(selector);
    }

    // handle kimbo object, plain objects or other objects
    return Kimbo.makeArray(selector, this);
  }

  Kimbo.fn = Kimbo.prototype = {

    /*\
     * $(…).length
     [ property ]
     * The length of the current Kimbo collection.
     = (number) Integer representing the lenght of the current collection.
     > Usage
     * Having these paragraphs:
     | <p>one</p>
     | <p>two</p>
     | <p>three</p>
     * Grab them and check for the length property:
     | $('p').length; // 3
    \*/
    length: 0,

    /*\
     * $(…).ready
     [ method ]
     * Execute a callback after de DOM is completely loaded
     > Parameters
     - callback (function) A function to call after de DOM is ready
     = (object) The original element
     > Usage
     | $(document).ready(function () {
     |   console.log('the DOM is loaded!');
     | });
     * Or using the shortcut
     | $(function () {
     |   console.log('the DOM is loaded!);
     | });
    \*/
    ready: function (callback) {
      // first check if already loaded
      if (/t/.test(document.readyState)) {
        callback.call(document);

      // listen when it loads
      } else {
        var completed = function() {
          document.removeEventListener('DOMContentLoaded', completed, false);
          callback();
        };
        document.addEventListener('DOMContentLoaded', completed, false);
      }

      return _.rootContext;
    },

    /*\
     * $(…).get
     [ method ]
     * Retrieve native DOM elements
     > Parameters
     - index (number) #optional A zero-based integer indicating which element to retrieve, supports going backwards with negative index.
     = (array|object) An array of the native DOM elements or the specified element by index matched by Kimbo.
     > Usage
     | <ul>
     |   <li id="foo"></li>
     |   <li id="bar"></li>
     | </ul>
     * Get standard array of elements
     | $('li').get(); // [<li id="foo">, <li id="bar">]
     * Get the first element
     | $('li').get(0); // <li id="foo">
     * Get the last element
     | $('li').get(-1); // <li id="bar">
    \*/
    get: function (index) {
      if (!this.length) {
        return;
      }
      return (!arguments.length) ? _.slice.call(this) : (index < 0 ? this[this.length + index] : this.constructor(this[index]));
    },

    // unique reference for the current instance of Kimbo
    ref: 'kimbo' + ('1' + Math.random()).replace(/\D/g, ''),

    // needed to have an array-like object
    splice: Array.prototype.splice
  };

  /*\
   * $.forEach
   [ method ]
   * Iterator function that can be used to seamlessly iterate over both objects and arrays.
   > Parameters
   - obj (object) Object or array to iterate
   - callback (function) Function that will be executed on each iteration
   = (object) The original array or object
   > Usage
   | // iterating array
   | $.forEach(['a', 'b', 'c'], function (index, value) {
   |   alert(index + ': ' + value);
   | });
   |
   | // iterating object
   | $.forEach({name: 'Denis', surname: 'Ciccale'}, function (key, value) {
   |   alert(key + ': ' + value);
   | });
  \*/
  Kimbo.forEach = function (obj, callback) {
    var i,
      l = obj.length,
      isObj = l === undefined || typeof obj === 'function';

    if (isObj) {
      for (i in obj) {
        if (obj.hasOwnProperty(i) && callback.call(obj[i], i, obj[i], obj) === false) {
          break;
        }
      }
    } else {
      for (i = 0; i < l; i++) {
        if (callback.call(obj[i], obj[i], i, obj) === false) {
          break;
        }
      }
    }

    // return original obj
    return obj;
  };


  /*\
   * $.extend
   [ method ]
   * Merge the contents of two or more objects together into the first object.
   > Parameters
   - target (object|boolean) Object that will receive the merged properties if objects are passed, or target will extend Kimbo object. If target is `true` the passed objects will be recursively merged.
   - objectN (object) #optional One or more objects with additional properties.
   = (object) The extended target or a new copy if target is an empty object.
   > Usage
   * When passing two or more objects, all properties will be merged into the target object.
   | var obj1 = { msg: 'hi', info: { from: 'Denis' }};
   | var obj2 = { msg: 'Hi!', info: { time: '22:00PM' }};
   |
   | // merge obj1 into obj2
   | $.extend(obj1, obj2);
   |
   | // now obj1 is equal to:
   | { msg: 'Hi!', info: { time: '22:00PM' }}
   * If an empty target object is passed, none of the other objects will be directly modified
   | // pass an empty target
   | var obj3 = $.extend({}, obj1, obj);
   * To do a recursive merge, pass true as first argument, then the objects to merge
   | $.extend(true, obj1, obj2);
   | // obj1 will be:
   | { msg: 'Hi!', info: { from: 'Denis', time: '22:00PM' }}
  \*/
  Kimbo.extend = Kimbo.fn.extend = function () {
    var objs = arguments,
      target = objs[0] || {},
      deep = (target === true),
      cut = 1;

    // check for deep copy
    if (deep) {
      target = objs[1] || {};
      cut = 2;

    // extend Kimbo itself if only one argument is passed
    } else if (objs.length === 1) {
      target = this;
      cut = 0;
    }

    // make an array from the arguments
    // removing unnecessary objects
    objs = _.slice.call(objs, cut);

    // loop through the objects
    Kimbo.forEach(objs, function (source) {
      // populate target from source
      Kimbo.forEach(source, function (key, value) {
        var src;

        if (deep && (Kimbo.isObject(value) || Kimbo.isArray(value))) {
          src = target[key];
          target[key] = Kimbo.extend(deep, src, value);

        } else if (value !== undefined) {
          target[key] = value;
        }
      });
    });

    return target;
  };

  Kimbo.require = function (module) {
    return modules[module];
  };

  Kimbo.define = function (module, fn) {
    modules[module] = fn(_);
  };

  // expose Kimbo to global object
  window.Kimbo = window.$ = Kimbo;

  // expose Kimbo as an AMD module
  if (typeof window.define === 'function' && window.define.amd) {
    window.define('kimbo', [], function () {
      return window.Kimbo;
    });
  }

}(window));
