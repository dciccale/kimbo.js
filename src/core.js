(function (window, document) {

  'use strict';

  /*\
   * $
   [ object ]
   * Global namespace for using Kimbo functions
  \*/

  // Kimbo modules
  var modules = {};

  // Common helpers
  var _ = {

    // Array methods
    push: Array.prototype.push,
    slice: Array.prototype.slice,

    // Reference to the current document
    rootContext: document,

    // Creates and returns a new Kimbo object
    kimbo: function (element, context) {
      return new Kimbo(element, context);
    }
  };

  /*\
   * $(…)
   * Kimbo object collection.
   * All methods called from a Kimbo collection affects all elements in it.
  \*/
  function Kimbo(selector, context) {
    var match, div, fragment;

    // Auto create a new instance of Kimbo if needed
    if (!(this instanceof Kimbo)) {
      return new Kimbo(selector, context);
    }

    // No selector, return empty Kimbo object
    if (!selector) {
      return this;
    }

    // Asume a css selector or html string
    if (typeof selector === 'string') {

      // Handle faster $('#id');
      match = /^#([\w\-]+)$/.exec(selector);
      if (match && match[1]) {
        match = document.getElementById(match[1]);

        if (match) {
          this[0] = match;
          this.length = 1;
        }

        return this;
      }

      // Create html from string
      if (selector.charAt(0) === '<') {
        div = document.createElement('div');
        div.innerHTML = selector;
        this.add(div.childNodes);
        fragment = new Kimbo(document.createDocumentFragment());
        // Detach the elements from the temporary DOM div.
        fragment.append(this);

        return this;
      }

      // All other selectors
      context = context ? _.kimbo(context) : _.rootContext;
      return context.find(selector);
    }

    // Already a dom element
    if (selector.nodeType) {
      this[0] = selector;
      this.length = 1;
      return this;
    }

    // Is a function, call it when DOM is ready
    if (Kimbo.isFunction(selector)) {
      return _.rootContext.ready(selector);
    }

    // Handle kimbo object, plain objects or other objects
    return Kimbo.makeArray(selector, this);
  }

  Kimbo.require = function (module) {
    return modules[module];
  };

  Kimbo.define = function (module, fn) {
    modules[module] = fn(_);
  };

  /*
   * Kimbo prototype aliased as fn
   */
  Kimbo.fn = Kimbo.prototype = {
    constructor: Kimbo,

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
     * Or using the shortcut (recommended)
     | $(function () {
     |   console.log('the DOM is loaded!);
     | });
    \*/
    ready: function (callback) {
      function _completed() {
        document.removeEventListener('DOMContentLoaded', _completed, false);
        callback.call(document);
      }

      // First check if already loaded, interactive or complete state so the t is enough
      if (/t/.test(document.readyState)) {

        // Execute the callback
        callback.call(document);

      // If not listen for when it loads
      } else {

        // Register the event
        document.addEventListener('DOMContentLoaded', _completed, false);
      }

      // Return the Kimbo wrapped document
      return _.rootContext;
    },

    /*\
     * $(…).get
     [ method ]
     * Retrieve native DOM elements from the current collection
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

      // If no index specified return a new set
      // Else return the element in the specified positive index or backwards if negative
      return (!arguments.length) ? _.slice.call(this) :
        (index < 0 ? this[this.length + index] : this[index]);
    },

    // Needed to have an array-like object
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
   | // Iterating array
   | $.forEach(['a', 'b', 'c'], function (value, index) {
   |   alert(value + ': ' + index);
   | });
   |
   | // Iterating object
   | $.forEach({name: 'Denis', surname: 'Ciccale'}, function (key, value) {
   |   alert(key + ': ' + value);
   | });
  \*/
  Kimbo.forEach = function (obj, callback) {
    var l = obj.length;
    var isArrayLike = Array.isArray(obj) || obj instanceof Kimbo ||
      obj instanceof window.NodeList || !((l !== undefined) || !l);
    var i;

    if (isArrayLike) {
      for (i = 0; i < l; i++) {
        if (callback.call(obj[i], obj[i], i, obj) === false) {
          break;
        }
      }
    } else {
      for (i in obj) {
        if (obj.hasOwnProperty(i) && callback.call(obj[i], i, obj[i], obj) === false) {
          break;
        }
      }
    }

    // Return original obj
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
   | // Merge obj1 into obj2
   | $.extend(obj1, obj2);
   |
   | // Now obj1 is equal to:
   | { msg: 'Hi!', info: { time: '22:00PM' }}
   * If an empty target object is passed, none of the other objects will be directly modified
   | // Pass an empty target
   | var obj3 = $.extend({}, obj1, obj);
   * To do a recursive merge, pass true as first argument, then the objects to merge
   | $.extend(true, obj1, obj2);
   | // Obj1 will be:
   | { msg: 'Hi!', info: { from: 'Denis', time: '22:00PM' }}
  \*/
  Kimbo.extend = Kimbo.fn.extend = function () {
    var objs = arguments;
    var target = objs[0] || {};
    var deep = (target === true);
    var cut = 1;

    // Check for deep copy
    if (deep) {
      target = objs[1] || {};
      cut = 2;

    // Extend Kimbo itself if only one argument is passed
    } else if (objs.length === 1) {
      target = this;
      cut = 0;
    }

    // Make an array from the arguments removing the target and/or the deep boolean
    objs = _.slice.call(objs, cut);

    // Loop through the objects
    Kimbo.forEach(objs, function (source) {

      // Populate target from source
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

  // Unique reference for the current instance of Kimbo
  Kimbo.ref = 'kimbo' + ('1' + Math.random()).replace(/\D/g, '');

  // Expose Kimbo as an AMD module
  if (typeof window.define === 'function' && window.define.amd) {
    window.define('kimbo', [], function () {
      return Kimbo;
    });
  }

  // Expose Kimbo to global object
  window.Kimbo = window.$ = Kimbo;

}(window, window.document));
