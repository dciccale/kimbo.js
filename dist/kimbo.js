/*!
 * kimbo v1.0.4 - 2013-12-11
 * http://kimbojs.com
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under the MIT license
 * https://github.com/dciccale/kimbo.js/blob/master/LICENSE.txt
 */
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
    document: document,
    rootContext: document,

    // Creates and returns a new Kimbo object
    kimbo: function (element) {
      return new Kimbo(element);
    }
  };

  /*\
   * $(…)
   * Kimbo object collection.
   * All methods called from a Kimbo collection affects all elements in it.
  \*/
  var Kimbo = function (selector, context) {
    var match;

    // Auto create a new instance of Kimbo if needed
    if (!(this instanceof Kimbo)) {
      return new Kimbo(selector, context);
    }

    // No selector, return empty Kimbo object
    if (!selector) {
      return this;
    }

    // Asume a css selector, query the dom
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
  };

  Kimbo.require = function (module) {
    return modules[module];
  };

  Kimbo.define = function (module, fn) {
    modules[module] = fn(_);
  };

  /*
   * Kimbo prototype aliased as fn
   */
  Kimbo.prototype = Kimbo.fn = {

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
      var completed;

      // First check if already loaded, interactive or complete state so the t is enough
      if (/t/.test(document.readyState)) {

        // Execute the callback
        callback.call(document);

      // If not listen for when it loads
      } else {
        completed = function () {

          // When completed remove the listener
          document.removeEventListener('DOMContentLoaded', completed, false);

          // Execute the callback
          callback.call(document);
        };

        // Register the event
        document.addEventListener('DOMContentLoaded', completed, false);
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
   | $.forEach(['a', 'b', 'c'], function (index, value) {
   |   alert(index + ': ' + value);
   | });
   |
   | // Iterating object
   | $.forEach({name: 'Denis', surname: 'Ciccale'}, function (key, value) {
   |   alert(key + ': ' + value);
   | });
  \*/
  Kimbo.forEach = function (obj, callback) {
    var l = obj.length;
    var isObj = l === undefined || typeof obj === 'function';
    var i;

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


Kimbo.define('data', function () {

  'use strict';

  var cache = {};
  var dataId = 1;

  var data = {
    get: function (el, key) {
      var dataCache = cache[el._dataId];
      var value;

      // Look first in cached data
      if (dataCache) {
        value = dataCache[key];

      // If none, try dataset
      } else {
        value = el.dataset[key];

        // Cache the value
        if (value) {
          this.set(el, key, value);
        }
      }

      return value;
    },

    set: function (el, key, value) {
      var elementId = el._dataId || (el._dataId = dataId++);
      var dataCache = cache[elementId];

      // Create data cache for the current element if necessary
      if (!dataCache) {
        dataCache = cache[elementId] = {};
      }

      dataCache[key] = value;
    },

    remove: function (el, key) {
      if (key === undefined) {
        cache[el._dataId] = {};
      } else {
        delete cache[el._dataId][key];
      }
    }
  };

  Kimbo.fn.extend({
    /*\
     * $(…).data
     [ method ]
     * Store or retrieve elements dataset.
     > Parameters
     - key (string) Key of the data attribute to to set.
     - value (string) #optional Value to store in dataset.
     = (object) Original matched collection.
     > Usage
     | <div id="panel"></div>
     * Set some data to the panel:
     | $('#panel').data('isOpen', true);
     * No a data-* attribute was added
     | <div id="panel" data-isOpen="true"></div>
     * We can retrieve the data
     | $('#panel').data('isOpen'); // 'true'
    \*/
    data: function (key, value) {
      if (!this.length || !Kimbo.isString(key)) {
        return this;
      }

      key = Kimbo.camelCase(key);

      // Get
      if (value === undefined) {
        return data.get(this[0], key);

      // Set
      } else {
        return this.each(function (el) {
          data.set(el, key, value);
        });
      }
    },

    /*\
     * $(…).removeData
     [ method ]
     * Remove data from the element dataset.
     > Parameters
     - key (string) Key of the data attribute to to remove.
     = (object) Original matched collection.
     > Usage
     | <div id="panel" data-isOpen="true"></div>
     * Remove data associated to the panel div:
     | $('#panel').removeData('isOpen');
     * Data attribute and value was removed:
     | <div id="panel"></div>
     * data-isOpen is undefined
     | $('#panel').data('isOpen'); // Undefined
    \*/
    removeData: function (key) {
      if (!this.length || !Kimbo.isString(key)) {
        return this;
      }

      key = Kimbo.camelCase(key);

      return this.each(function (el) {
        data.remove(el, key);
      });
    }
  });

  return data;
});


Kimbo.define('css', function (_) {

  'use strict';

  // Properties without 'px' at the end
  var CSS_NO_PX = {
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    zIndex: true
  };

  // Wrap native to extend behavoiur
  var _getComputedStyle = function (element, property) {

    // Support both camelCase and dashed property names
    property = property.replace(/([A-Z])/g, '-$1').toLowerCase();

    return window.getComputedStyle(element, null).getPropertyValue(property);
  };

  var iframe = null;

  var createIframe = function () {
    iframe = _.document.createElement('iframe');
    _.document.documentElement.appendChild(iframe);
    return iframe;
  };

  var getActualDisplay = function (nodeName, doc) {
    doc = doc || _.document;

    var elem, display;

    // Create and append the node
    elem = doc.createElement(nodeName);
    doc.body.appendChild(elem);

    // Get display
    display = _getComputedStyle(elem, 'display');

    // Remove it from the dom
    elem.parentNode.removeChild(elem);

    return display;
  };

  var elementsDisplay = {};

  Kimbo.fn.extend({
    /*\
     * $(…).show
     [ method ]
     * Display all matched elements.
     = (object) Original matched collection.
     > Usage
     | <p style="display: none;">Lorem</p>
     * Show it
     | $('p').show();
     * Now it's visible
     | <p style="display: block;">Lorem</p>
    \*/
    show: function () {
      return this.each(function (el) {
        var nodeName = el.nodeName;
        var display = elementsDisplay[nodeName];
        var doc;

        if (!display) {
          display = getActualDisplay(nodeName);

          // If still fails for some css rule try creating the element in an isolated iframe
          if (display === 'none' || !display) {

            // Use the already-created iframe if possible
            iframe = (iframe || createIframe());

            doc = (iframe.contentWindow || iframe.contentDocument).document;
            doc.write('<!doctype html><html><body>');
            doc.close();
            display = getActualDisplay(nodeName, doc);
            iframe.parentNode.removeChild(iframe);
          }

          // Save the default display for this element
          elementsDisplay[nodeName] = display;
        }

        el.style.display = display || 'block';
      });
    },

    /*\
     * $(…).hide
     [ method ]
     * Hide all matched elements.
     = (object) Original matched collection.
     > Usage
     | <p>Lorem</p>
     * Hide it
     | $('p').hide();
     * Now it's hidden
     | <p style="display: none;">Lorem</p>
    \*/
    hide: function () {
      return this.each(function (el) {
        var nodeName = el.nodeName;
        var display = elementsDisplay[nodeName];

        if (!display) {
          display = _getComputedStyle(el, 'display');
          elementsDisplay[nodeName] = display;
        } else {
          display = el.style.display;
        }

        // Only hide if not already hidden
        if (display !== 'none') {
          el.style.display = 'none';
        }
      });
    },

    /*\
     * $(…).css
     [ method ]
     * Get the css value of a property from one element or set a css property to all matched elements.
     > Parameters
     - property (string|object) Name of the css property.
     - value (string|number) #optional Value for the property.
     = (object) Original matched collection.
     > Usage
     | <p>Hello dude!</p>
     * Modify some styles
     | $('p').css('color', 'red'); // Now the text is red
     * The HTML will look like this:
     | <p style="color: red;">Hello dude!</p>
     * You can also pass an object for setting multiple properties at the same time
     | $('p').css({
     |   color: 'red',
     |   'font-size': '30px',
     |   backgroundColor: 'blue'
     | });
     * Properties can be dash-separated (add quotes) or camelCase.
     | <p style="color: red; font-size: 30px; background-color: blue">Hello dude!</p>
    \*/
    css: function (property, value) {
      var that = this;
      var setCss;

      if (!this.length || (!Kimbo.isString(property) && !Kimbo.isObject(property))) {
        return this;
      }

      setCss = function (name, value) {

        // If it's a number add 'px' except for some properties
        if (Kimbo.isNumeric(value) && !CSS_NO_PX[Kimbo.camelCase(name)]) {
          value += 'px';
        }

        // Apply styles to all elements in the set
        that.each(function (el) {
          el.style[name] = value;
        });
      };

      // Setting one property
      if (Kimbo.isString(property)) {

        // Get
        if (value === undefined) {
          return _getComputedStyle(this[0], property);

        // Set
        } else {
          setCss(property, value);
        }

      // Multiple properties with an object
      } else if (Kimbo.isObject(property)) {
        Kimbo.forEach(property, setCss);
      }

      return this;
    }
  });
});


Kimbo.define('manipulation', function (_) {

  'use strict';

  var SPACE_RE = /\s+/;

  // Browser native classList
  var _hasClass = function (el, name) {
    return (el.nodeType === 1 && el.classList.contains(name));
  };

  /*\
   * $(…).text
   [ method ]
   * Get the text of the first element in the set or set the text of all the matched elements.
   > Parameters
   - value (string) #optional A string of text to set as the text content of all matched elements.
   = (string) string value of the text content of the element if no parameter passed.
   = (object) current Kimbo object.
   > Usage
   * Get the text content of an element
   | <p>Demo text</p>
   * without passing any parameter to the function:
   | $('p').text(); // 'Demo text'
   * To replace the text of the paragraph pass a string parameter to the function:
   | $('p').text('Another text');
   * Now the text content was replaced:
   | <p>Another text</p>
  \*/

  /*\
   * $(…).html
   [ method ]
   * Get the HTML content of the first element in the set or set the HTML content of all the matched elements.
   > Parameters
   - value (string) #optional A string of HTML to set as the HTML content of all matched elements.
   = (string) a string value of the HTML content of the element if no parameter passed.
   = (object) current Kimbo object.
   > Usage
   * Get the HTML content of an element
   | <p><span>Demo text<span></p>
   * without passing any parameter to the function:
   | $('p').html(); // '<span>Demo tetxt</span>'
   * To replace the HTML content of the paragraph pass a string parameter to the function:
   | $('p').html('<strong>Another content</strong>');
   * Now the text content was replaced:
   | <p><strong>Another content</strong></p>
  \*/

  /*\
   * $(…).val
   [ method ]
   * Get the current value of the first element in the set or set the value of all the matched elements.
   > Parameters
   - value (string) #optional A string of text to set as the value of all matched elements.
   = (string) the current value of the first element if no parameter passed
   = (object) current Kimbo object
   > Usage
   * Get the value of a form element:
   | <input type="text" name="color" value="red" />
   * without passing any parameter to the function:
   | $('input').val(); // 'red'
   * To change the value of the input pass a string parameter to the function:
   | $('input').val('blue');
   * Now the value was changed:
   | $('input').val(); // 'blue'
  \*/
  Kimbo.forEach({
    text: 'textContent',
    html: 'innerHTML',
    val: 'value'
  }, function (method, prop) {
    Kimbo.fn[method] = function (value) {

      // No element
      if (!this.length) {
        return undefined;
      }

      // Get
      if (value === undefined) {
        return this[0][prop];

        // Set
      } else {
        return this.each(function (el) {
          el[prop] = value;
        });
      }
    };
  });

  /*\
   * $(…).addClass
   [ method ]
   * Adds a class to all matched elements.
   > Parameters
   - name (string) Name of the class to add.
   = (object) Original matched collection.
   > Usage
   | <p>I want to be green</p>
   | <script>
   | $('p').addClass('green');
   | </script>
   * Now it's green
   | <p class="green">I want to be green</p>
   * You can add multiple classes separated by a space
   | <p>Add classes to me</p>
   | <script>
   | $('p').addClass('green big width100');
   | </script>
   * All classes added and they won't be repetead if you try to add an existing one
   | <p class="green big width100">Add classes to me</p>
  \*/

  /*\
   * $(…).removeClass
   [ method ]
   * Removes a class to all matched elements.
   > Parameters
   - name (string) Name of the class to remove.
   = (object) Original matched collection.
   > Usage
   | <p class="big green title float-rigth">Lorem ipsum</p>
   * Remove a specific class from the paragraph:
   | $('p').removeClass('green');
   * The specified class was removed:
   | <p class="big title float-right">Lorem ipsum</p>
   * You can remove multiple classes separating them by a space when calling the function:
   | $('p').removeClass('big title');
   * Now only one class left:
   | <p class="float-right">Lorem ipsum</p>
   * You can remove all classes just calling .removeClass() without parameters
   | $('p').removeClass();
   * All classes were removed including the class attribute:
   | <p>Lorem ipsum</p>
  \*/

  // Generate addClass and removeClass methods
  // Use native classList
  // Mdn: https://developer.mozilla.org/en-US/docs/DOM/element.classList
  // Spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/elements.html#dom-classlist
  Kimbo.forEach(['add', 'remove'], function (method, i) {
    var isRemove = i > 0;

    Kimbo.fn[method + 'Class'] = function (name) {
      var classNames;

      if (name && Kimbo.isString(name)) {
        classNames = name.split(SPACE_RE);
        this.each(function (el) {

          // Skip comments, text, etc
          if (el.nodeType === 1) {

            // Iterate through all class names passed
            Kimbo.forEach(classNames, function (className) {
              el.classList[method](className);
            });
          }
        });

        // Remove all element classes if no classname specified
      } else if (!name && isRemove) {
        this.removeAttr('class');
      }

      return this;
    };
  });

  /*\
   * $(…).append
   [ method ]
   * Insert content to the end of all elements matched by Kimbo.
   > Parameters
   - value (string|object) HTML string, DOM element, or Kimbo object to insert.
   = (object) Original matched collection.
   > Usage
   | <div class="container">
   |   <p class="lorem">Lorem </p>
   |   <p class="lorem">Lorem </p>
   | </div>
   * Insert content
   | $('.lorem').append('<em>ipsum</em>')
   * Each element gets the content
   | <div class="container">
   |   <p class="lorem">Lorem <em>ipsum</em></p>
   |   <p class="lorem">Lorem <em>ipsum</em></p>
   | </div>
   * You can also get an element and insert it elsewhere
   | $('.container').append($('.ipsum'))
   * The selected element will be moved, not cloned.
   | <div class="container">
   |   <p class="lorem">Lorem</p>
   |   <p class="lorem">Lorem</p>
   |   <p class="ipsum">Ipsum</p>
   | </div>
  \*/

  /*\
   * $(…).prepend
   [ method ]
   * Insert content to the beginning of all elements matched by Kimbo.
   > Parameters
   - value (string|object) HTML string, DOM element, or Kimbo object to insert.
   = (object) Original matched collection.
   > Usage
   | <div class="container">
   |   <p class="lorem"> Lorem</p>
   |   <p class="lorem"> Lorem</p>
   | </div>
   * Insert content
   | $('.lorem').prepend('<em>ipsum</em>')
   * Each element gets the content
   | <div class="container">
   |   <p class="lorem"><em>ipsum</em> Lorem</p>
   |   <p class="lorem"><em>ipsum</em> Lorem</p>
   | </div>
   * You can also get an element and insert it elsewhere
   | $('.container').prepend($('.ipsum'))
   * The selected element will be moved, not cloned.
   | <div class="container">
   |   <p class="ipsum">Ipsum</p>
   |   <p class="lorem">Lorem</p>
   |   <p class="lorem">Lorem</p>
   | </div>
  \*/

  // Generate append and prepend methods
  Kimbo.forEach(['append', 'prepend'], function (method, i) {
    var isPrepend = i > 0;

    Kimbo.fn[method] = function (value) {
      var div;

      // Exit if no value passed
      if (!this.length || !value) {
        return this;
      }

      // Handle html string
      if (Kimbo.isString(value)) {

        // Placeholder element
        div = document.createElement('div');
        div.innerHTML = value;
        value = div.firstChild;
      }

      // Already a dom node or kimbo collection, just insert it
      if (value.nodeType || (value instanceof Kimbo)) {
        return this.each(function (el) {

          // Be sure we can append/prepend to the element
          if (el.nodeType === 1 || el.nodeType === 11) {
            _.kimbo(value).each(function (_el) {
              el.insertBefore(_el, isPrepend ? el.firstChild : null);
            });
          }
        });
      }
    };
  });

  Kimbo.fn.extend({
    /*\
     * $(…).empty
     [ method ]
     * Remove all child nodes from the DOM of the elements in the collection.
     = (object) Original matched collection.
     > Usage
     | <div class="container">
     |   <p class="lorem">Lorem</p>
     |   <p class="lorem">Lorem</p>
     | </div>
     * Empty .container
     | $('.container').empty();
     * All elements inside ".container" are removed from the DOM
     | <div class="container"></div>
    \*/
    empty: function () {
      return this.each(function (el) {
        while (el.hasChildNodes()) {
          el.removeChild(el.childNodes[0]);
        }
      });
    },

    /*\
     * $(…).remove
     [ method ]
     * Remove all matched elements from the DOM.
     * Similar to @$(…).empty but .remove() removes the element itself
     = (object) Original matched collection.
     > Usage
     | <div class="container">
     |   <p class="lorem">Lorem</p>
     |   <p>Lorem</p>
     | </div>
     * Remove one element
     | $('.lorem').remove();
     * The result element is:
     | <div class="container">
     |   <p>Lorem</p>
     | </div>
    \*/
    remove: function () {
      return this.each(function (el) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    },

    // Todo: extend to accept objects and functions to set values
    /*\
     * $(…).attr
     [ method ]
     * Get an attribute value from one element or set attributes to all matched elements.
     > Parameters
     - name (string) Name of the attribute.
     - value (string) #optional Value for the attribute.
     = (string) Attribute value, only if name was passed.
     = (object) Original matched collection when setting a value.
     > Usage
     | <a href="http://kimbojs.com">Go to Kimbojs.com</a>
     * Get href attribute
     | $('a').attr('href'); // Http://kimbojs.com
     * Set a new attribute
     | $('a').attr('title', 'Go to Kimbojs.com');
     * Now element has a title attribute
     | <a href="http://kimbojs.com" title="Go to Kimbojs.com">Go to Kimbojs.com</a>
    \*/
    attr: function (name, value) {
      if (!this.length) {
        return this;
      }

      if (Kimbo.isString(name) && value === undefined) {
        return this[0].getAttribute(name);
      } else {
        return this.each(function (el) {
          el.setAttribute(name, value);
        });
      }
    },

    /*\
     * $(…).removeAttr
     [ method ]
     * Removes an attribute from all matched elements.
     > Parameters
     - name (string) Name of the attribute to remove.
     = (object) Original matched collection.
     > Usage
     | <a href="http://kimbojs.com" title="Go to Kimbojs.com">Go to Kimbojs.com</a>
     * Remove the title attribute
     | $('a').removeAttr('title');
     * Now the element has no title
     | <a href="http://kimbojs.com">Go to Kimbojs.com</a>
    \*/
    removeAttr: function (name) {
      return this.each(function (el) {
        el.removeAttribute(name);
      });
    },

    /*\
     * $(…).toggleClass
     [ method ]
     * Removes a class to all matched elements.
     > Parameters
     - name (string) Name of the class to toggle.
     - state (boolean) #optional If state is true the class will be added, if false, removed.
     = (object) Original matched collection.
     > Usage
     | <p class="foo">Lorem ipsum.</p>
     | <script>
     | $('p').toggleClass('foo');
     | </script>
     * The `p` element has the class foo soo it will be removed
     | <p>Lorem ipsum.</p>
    \*/
    toggleClass: function (name, state) {
      var classNames;

      if (this.length && name && Kimbo.isString(name)) {

        classNames = name.split(SPACE_RE);

        this.each(function (el) {
          Kimbo.forEach(classNames, function (name) {

            // Use custom toggle (anyway it uses classList.add/remove)
            state = Kimbo.isBoolean(state) ? state : !_hasClass(el, name);
            _.kimbo(el)[state ? 'addClass' : 'removeClass'](name);
          });
        });
      }

      return this;
    },

    /*\
     * $(…).hasClass
     [ method ]
     * Determine whether any matched elements has the given class.
     > Parameters
     - name (string) Name of the class to search for.
     = (object) Original matched collection.
     > Usage
     | <p class="asd foo qwe">Lorem ipsum.</p>
     * Check if the element has the class 'foo'
     | $('p').hasClass('foo'); // True
     * You could also check if it has multiple classes
     | $('p').hasClass('qwe asd'); // True
    \*/
    hasClass: function (name) {
      var has = false;
      var classNames;

      if (this.length && name && Kimbo.isString(name)) {

        classNames = name.trim().split(SPACE_RE);

        this.each(function (el) {

          // Classlist.contains only accepts one class parameter
          Kimbo.forEach(classNames, function (name) {
            has = _hasClass(el, name);

            // When only one is missing break the loop
            if (!has) {
              return false;
            }
          });
        });
      }

      return has;
    },

    /*\
     * $(…).clone
     [ method ]
     * Clones a DOM node.
     > Parameters
     = (object) Original matched collection.
     > Usage
     | <p class="asd foo qwe">Lorem ipsum.</p>
     | var p1 = $('p'); // Grab the p element
     | var p2 = p1.clone(); // Clone p1 into p2
     | console.log(p2 === p1); // False
    \*/
    clone: function () {
      return this.each(function (el) {
        return el.cloneNode(true);
      });
    }
  });

  // Generate get/set .width() and .height() methods
  /*\
   * $(…).width
   [ method ]
   * Get the current width of the first element or set the width of all matched elements.
   > Parameters
   - value (number|string) #optional An integer indicating the width of the element or a string width a unit of measure.
   = (number) the actual width of the element if no parameter passed.
   = (object) Kimbo object.
   > Usage
   | <style>
   |   div { width: 100px; }
   | </style>
   | <div>Actual width is 100px</div>
   * Get the width:
   | $('div').width(); // 100
   * Change the width:
   | $('div').width(200); // Now its width is 200
   * Or passing a specific unit:
   | $('div').width('50%'); // Now its width is 50%
  \*/

  /*\
   * $(…).height
   [ method ]
   * Get the current height of the first element or set the height of all matched elements.
   > Parameters
   - value (number|string) #optional An integer indicating the height of the element or a string height a unit of measure.
   = (number) the actual height of the element if no parameter passed.
   = (object) Kimbo object.
   > Usage
   | <style>
   |   div { height: 100px; }
   | </style>
   | <div>Actual height is 100px</div>
   * Get the height:
   | $('div').height(); // 100
   * Change the height:
   | $('div').height(200); // Now its height is 200
   * Or passing a specific unit:
   | $('div').height('50%'); // Now its height is 50%
  \*/
  Kimbo.forEach(['width', 'height'], function (dimension) {
    Kimbo.fn[dimension] = function (value) {
      if (!value) {
        return parseInt(this.css(dimension), 10);
      }

      return this.css(dimension, value);
    };
  });
});


Kimbo.define('traversing', function (_) {

  'use strict';

  var query = Kimbo.require('query');

  var _filter = Array.prototype.filter;

  var IS_UNIQUE = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };

  // Use native matchesSelector
  var _matchesSelector = _.document.documentElement.webkitMatchesSelector ||
    _.document.documentElement.mozMatchesSelector ||
    _.document.documentElement.oMatchesSelector ||
    _.document.documentElement.matchesSelector;

  var _matches = function (elem, selector) {
    return (!elem || elem.nodeType !== 1) ? false : _matchesSelector.call(elem, selector);
  };

  // Remove duplicates from an array
  var _unique = function (array) {
    return array.filter(function (item, index) {
      return array.indexOf(item) === index;
    });
  };

  var _sibling = function (node, elem) {
    var result = [];
    for (; node; node = node.nextSibling) {
      if (node.nodeType === 1 && node !== elem ) {
        result.push(node);
      }
    }
    return result;
  };

  var _singleSibling = function (node, prop) {
    do {
      node = node[prop];
    } while (node && node.nodeType !== 1);

    return node;
  };

  Kimbo.fn.extend({
    /*\
     * $(…).filter
     [ method ]
     * Filter element collection by the passed argument.
     > Parameters
     - selector (string|object|function) The argument by which the collection will be filtered.
     = (object) Filtered elements collection.
     > Usage
     | <ul>
     |   <li>One</li>
     |   <li>Two</li>
     |   <li>Three</li>
     |   <li>Four</li>
     | </ul>
     * Get even items.
     | $('li').filter(':nth-child(even)').addClass('even');
     * Only even items were affected.
     | <ul>
     |   <li>One</li>
     |   <li class="even">Two</li>
     |   <li>Three</li>
     |   <li class="even">Four</li>
     | </ul>
     > Using a function(index, element)
     * You can also filter the collection using a function, receiving the current index and element in the collection.
     | $('li').filter(function (index, element) {
     |   return index % 3 == 2;
     | }).addClass('red');
     * This will add a 'red' class to the third, sixth, ninth elements and so on...
     > Filter by DOM or Kimbo object
     * You can also filter by a DOM or Kimbo object.
     | $('li').filter(document.getElementById('id'));
     | // Or a Kimbo object
     | $('li').filter($('#id'));
    \*/
    filter: function (selector) {
      var result;

      // Filter collection
      result = _filter.call(this, function (elem, i) {
        var ret;

        if (Kimbo.isFunction(selector)) {
          ret = !!selector.call(elem, i, elem);
        } else if (Kimbo.isString(selector)) {
          ret = _matches(elem, selector);
        } else if (selector.nodeType) {
          ret = elem === selector;
        } else if (selector instanceof Kimbo) {
          ret = elem === selector[0];
        }

        return ret;
      });

      return _.kimbo(result);
    },

    /*\
     * $(…).eq
     [ method ]
     * Reduce the matched elements collection to the one at the specified index.
     > Parameters
     - index (number) An integer indicating the position of the element. Use a negative number to go backwards in the collection.
     = (object) Kimbo object at specified index.
     > Usage
     | <ul>
     |   <li>Item 1</li>
     |   <li>Item 2</li>
     |   <li>Item 3</li>
     |   <li>Item 4</li>
     | </ul>
     * Get 3rd element, index always start at 0, so to get the 3rd we need to pass the number 2.
     | $('li').eq(2); // Item 3
    \*/
    eq: function (i) {
      return this.length && i === -1 ? this.slice(i) : this.slice(i, i + 1);
    },

    /*\
     * $(…).first
     [ method ]
     * Reduce the matched elements collection to the first in the set.
     = (object) First Kimbo object of the collection
     > Usage
     | <ul>
     |   <li>Item 1</li>
     |   <li>Item 2</li>
     |   <li>Item 3</li>
     | </ul>
     * Get only the first element
     | $('li').first(); // Item 1
    \*/
    first: function () {
      return this.eq(0);
    },

    /*\
     * $(…).last
     [ method ]
     * Reduce the matched elements collection to the last in the set.
     = (object) Last Kimbo object of the collection
     > Usage
     | <ul>
     |   <li>Item 1</li>
     |   <li>Item 2</li>
     |   <li>Item 3</li>
     | </ul>
     * Get only the last element
     | $('li').last(); // Item 3
    \*/
    last: function () {
      return this.eq(-1);
    },

    /*\
     * $(…).slice
     [ method ]
     * Reduce the matched elements collection to a subset specified by a range of indices
     > Parameters
     - start (number) An integer indicating the position at which the elements begin to be selected. Use a negative number to go backwards in the collection.
     - end (number) #optional An integer indicating the position at which the elements stop being selected. Use a negative number to start at the end of the collection. If ommited, the range continues to the end.
     = (object) Reduced Kimbo object collection in the range specified
     > Usage
     | <ul>
     |   <li>Item 1</li>
     |   <li>Item 2</li>
     |   <li>Item 3</li>
     |   <li>Item 4</li>
     |   <li>Item 5</li>
     | </ul>
     * This will add the class selected to Item 3, 4 and 5, as the index starts at 0
     | $('li').slice(2).addClass('selected');
     * This will select only Items 3 and 4
     | $('li').slice(2, 4).addClass('selected');
     > Negative index
     * Here only Item 4 will be selected since is the only between -2 (Item 3) and -1 (Item 5)
     | $('li').slice(-2, -1).addClass('selected');
    \*/
    slice: function () {
      return this.length && _.kimbo(_.slice.apply(this, arguments));
    },

    /*\
     * $(…).each
     [ method ]
     * Iterate over a Kimbo objct, executing a function for each element.
     > Parameters
     - callback (function) A function to call for each element in the collection.
     = (object) Kimbo object
     > Usage
     * Here we have an unordered list:
     | <ul>
     |   <li>Item 1</li>
     |   <li>Item 2</li>
     |   <li>Item 3</li>
     | </ul>
     * You can iterate over all the list items and execute a function
     | $('li').each(function (el, index, collection) {
     |   console.log('index of ' + $(this).text() + ' is: ' + index);
     | });
     * This will log the following message
     *
     * index of Item 1 is: 0
     *
     * index of Item 2 is: 1
     *
     * index of Item 3 is: 2
    \*/
    each: function (callback) {
      return Kimbo.forEach(this, callback);
    },

    /*\
     * $(…).map
     [ method ]
     * Execute a function for each element in the collection, producing a new Kimbo set with the returned values
     > Parameters
     - callback (function) A function to call for each element in the collection.
     = (object) Kimbo object
     > Usage
     * Here we have an unordered list:
     | <ul>
     |   <li id="item1">Item 1</li>
     |   <li id="item2">Item 2</li>
     |   <li id="item3">Item 3</li>
     | </ul>
     * You can call a function for each element to create a new Kimbo object
     | $('li').map(function (el, index) {
     |   return this.id;
     | }).get().join();
     * This will produce a list of the item ids.
     | "item1,item2,item3"
    \*/
    map: function (callback) {
      return _.kimbo(Kimbo.map(this, function (elem, i) {
        return callback.call(elem, elem, i);
      }));
    },

    /*\
     * $(…).find
     [ method ]
     * Find descendant elements for each element in the current collection.
     > Parameters
     - selector (string) A string selector to match elements.
     = (object) Kimbo object
     > Usage
     * Here we have some HTML
     | <div id="container">
     |   <p>Demo</p>
     |   <div class="article">
     |     <p>This is an article</p>
     |     <p>with some paragraphs</p>
     |   </div>
     | </div>
     * You can find all paragraph elements inside the article:
     | $('.article').find('p');
    \*/
    find: function (selector) {
      var i, l, length, n, r, result, elems;

      // Make new empty kimbo collection
      result = _.kimbo();

      // Could use Kimbo.forEach, but this is a bit faster..
      for (i = 0, l = this.length; i < l; i++) {
        length = result.length;

        // Get elements
        elems = query.find(this[i], selector);

        // Push them to current kimbo collection
        _.push.apply(result, elems);

        if (i) {

          // Make results unique
          for (n = length; n < result.length; n++) {
            for (r = 0; r < length; r++) {
              if (result[r] === result[n]) {
                result.splice(n--, 1);
                break;
              }
            }
          }
        }
      }

      return result;
    },

    /*\
     * $(…).closest
     [ method ]
     * Get a Kimbo collection that matches the closest selector
     > Parameters
     - selector (string) A string selector to match elements.
     - context (string) #optional A DOM element within which matching elements may be found.
     = (object) Kimbo object
     > Usage
     * Here we have a nested unordered lists:
     | <ul>
     |   <li>
     |     Item 1
     |     <ul class="ul-level-2">
     |       <li class="item-1-1">Item 1.1</li>
     |       <li class="item-1-2">Item 1.2</li>
     |     </ul>
     |   </li>
     |   <li>Item 2</li>
     | </ul>
     * You can find the containing ul of the items in the nested ul:
     | $('.item-1-1').closest('ul');
     * This will return `ul.level-2` element
    \*/
    closest: function (selector, context) {
      var l = this.length;
      var result = [];
      var closest = function (node) {

        // Check selector match and grab the element
        while (node && !_matches(node, selector)) {
          node = node !== context && node !== _.document && node.parentNode;
        }
        return node;
      };

      if (!l) {
        return this;

      // Get closest only for one element
      } else if (l === 1) {
        result = closest(this[0]);

      // Get closest from all elements in the set
      } else {
        Kimbo.forEach(this, function (node) {
          node = closest(node);
          if (node) {
            result.push(node);
          }
        });

        // Only unique results
        result = result.length > 1 ? _unique(result) : result;
      }

      return _.kimbo(result);
    },

    /*\
     * $(…).contains
     [ method ]
     * Determine whether an element is contained by the current matched element.
     > Parameters
     - element (string|object) Selector of the element or the actual DOM or Kimbo object.
     = (boolean) true if it is contained, false if not.
     > Usage
     | <div id="container">
     |   <p id="inside">Inside paragraph</p>
     | </div>
     | <p id="outside">Outside paragraph</p>
     * The paragraph with id "inside" is actually contained by "#container"
     | $('#container').contains('#inside'); // True
     * The paragraph ourside is not contained
     | var outside_p = $('#outside');
     | $('#container').contains(outside_p); // False
    \*/
    contains: function (element) {
      element = (element instanceof Kimbo) ? element[0] :
        (Kimbo.isString(element) ? this.find(element)[0] : element);

      return query.contains(this[0], element);
    },

    /*\
     * $(…).add
     [ method ]
     * Add elements to the current Kimbo collection.
     > Parameters
     - selector (string|object) Selector of the element or the actual DOM or Kimbo object.
     - context (string|object) #optional Selector of the context element or the actual DOM or Kimbo object.
     = (object) The merged Kimbo collection.
     > Usage
     | <ul id="menu1">
     |   <li>Apple</li>
     |   <li>Orange</li>
     | </ul>
     |
     | <ul id="menu2">
     |   <li>Lemon</li>
     |   <li>Banana</li>
     | </ul>
     * Get the items from the #menu1 and add the ones from #menu2, all the following ways will produce the same collection
     | $('#menu1 li').add('#menu2 li');
     * or
     | $('#menu1 li').add('li', '#menu2');
     * or
     | $('#menu1 li').add($('#menu2 li'));
    \*/
    add: function (selector, context) {
      var set = Kimbo.isString(selector) ? _.kimbo(selector, context) :
        Kimbo.makeArray(selector && selector.nodeType ? [selector] : selector);

      var all = Kimbo.merge(this, set);

      return _.kimbo(all);
    },

    /*\
     * $(…).is
     [ method ]
     * Check the current elements collection against a selector, object or function.
     - selector (string|object|function) The argument by which the collection will be matched against.
     = (boolean)
     > Usage
     | <ul>
     |   <li>Click the <em>Apple</em></li>
     |   <li><span>Click the Orange</span></li>
     |   <li>Or the Banana</li>
     | </ul>
     * Test if the current clicked element is an `<li>` element.
     | $('ul').click(function (event) {
     |   var $target = $(event.target);
     |   if ($target.is('li')) {
     |     $target.css('background-color', 'red');
     |   }
     | });
    \*/
    is: function (selector) {
      return !!(this.length && this.filter(selector).length);
    }
  });

  Kimbo.forEach({
    /*\
     * $(…).parent
     [ method ]
     * Get the parent of each element matched in the current collection.
     * If a selector is specified, it will return the parent element only if it matches that selector.
     - selector (string) #optional A string containing a selector expression to match elements against
     = (object) Kimbo object
     > Usage
     * Suppose a page with this HTML:
     | <ul>
     |   <li class="item-a">Item 1</li>
     |   <li class="item-b">Item 2</li>
     | </ul>
     * Get the parent element of `.item-a`
     | $('.item-a').parent(); // Ul
    \*/
    parent: function (elem) {
      var parent = elem.parentNode;

      return parent && parent.nodeType !== 11 ? parent : null;
    },

    /*\
     * $(…).next
     [ method ]
     * Get the immedeately following sibling of each element in the current collection.
     * If a selector is specified, it will return the element only if it matches that selector.
     - selector (string) #optional A string containing a selector expression to match elements against
     = (object) Kimbo object
     > Usage
     * Suppose a page with this HTML:
     | <ul>
     |   <li class="item-a">Item 1</li>
     |   <li class="item-b">Item 2</li>
     | </ul>
     * Get the parent element of `.item-a`
     | $('.item-a').next(); // .item-b
    \*/
    next: function (elem) {
      return _singleSibling(elem, 'nextSibling');
    },

    /*\
     * $(…).prev
     [ method ]
     * Get the immedeately previous sibling of each element in the current collection.
     * If a selector is specified, it will return the element only if it matches that selector.
     - selector (string) #optional A string containing a selector expression to match elements against
     = (object) Kimbo object
     > Usage
     * Suppose a page with this HTML:
     | <ul>
     |   <li class="item-a">Item 1</li>
     |   <li class="item-b">Item 2</li>
     | </ul>
     * Get the parent element of `.item-a`
     | $('.item-b').prev(); // .item-a
    \*/
    prev: function (elem) {
      return _singleSibling(elem, 'previousSibling');
    },

    /*\
     * $(…).sibling
     [ method ]
     * Get the immedeately previous sibling of each element in the current collection.
     * If a selector is specified, it will return the element only if it matches that selector.
     - selector (string) #optional A string containing a selector expression to match elements against
     = (object) Kimbo object
     > Usage
     * Suppose a page with this HTML:
     | <ul>
     |   <li class="item-a">Item 1</li>
     |   <li class="item-b">Item 2</li>
     | </ul>
     * Get the parent element of `.item-a`
     | $('.item-b').prev(); // .item-a
    \*/
    siblings: function (elem) {
      return _sibling((elem.parentNode || {}).firstChild, elem);
    },

    /*\
     * $(…).children
     [ method ]
     * Get the children of all matched elements, optionally filtered by a selector.
     - selector (string) #optional A string selector to match elements against.
     = (object) Kimbo object
     > Usage
     * Suppose a page with the following HTML:
     | <div class="demo">
     |   <p>This</p>
     |   <p>is</p>
     |   <p>a</p>
     |   <p>demo.</p>
     | </div>
     * Get all children of `.demo`:
     | $('.demo').children(); // Al <p> tags inside .demo div
     * Another example passing an specific selector:
     | <form>
     |   <input type="text" name="name" />
     |   <input type="text" name="last" />
     |   <input type="submit" value="Send" />
     | </form>
     * Get only the children that are text type elements:
     | $('form').children('input[type="text"]'); // Only name and last inputs
    \*/
    children: function (elem) {
      return _sibling(elem.firstChild);
    },

    /*\
     * $(…).contents
     [ method ]
     * Get the HTML content of an iframe
     = (object) Kimbo object
     > Usage
     * Suppose an iframe loading an external page:
     | <iframe src="http://api.kimbojs.com"></iframe>
     * Find the body element of the contents of that iframe:
     | $('iframe').contents().find('body');
    \*/
    contents: function (elem) {
      return elem.nodeName.toLowerCase() === 'iframe' ? elem.contentDocument || elem.contentWindow[_.document] : Kimbo.makeArray(elem.childNodes);
    }
  }, function (name, fn) {
    Kimbo.fn[name] = function (selector) {
      var ret;

      if (!this.length) {
        return this;
      }

      ret = Kimbo.map(this, fn);

      // Clean collection
      ret = this.length > 1 && !IS_UNIQUE[name] ? _unique(ret) : ret;

      if (Kimbo.isString(selector)) {
        ret = _.kimbo(ret).filter(selector);
      }

      return _.kimbo(ret);
    };
  });
});


Kimbo.define('utilities', function (_) {

  'use strict';

  // Mobile userAgent escaped regexes
  var ANDROID_RE = '(Android)\\s+([\\d.]+)';
  var BLACKBERRY_RE = '(BlackBerry|BB10|Playbook).*Version\/([\\d.]+)';
  var FIREFOXOS_RE = '(Mozilla).*Mobile[^\/]*\/([\\d.]*)';
  var IPAD_RE = '(iPad).*OS\\s([\\d_]+)';
  var IPHONE_RE = '(iPhone\\sOS)\\s([\\d_]+)';
  var WEBOS = '(web|hpw)OS[\\s\/]([\\d.]+)';

  // Full regexp to test the userAgent
  var MOBILE_OS_RE = new RegExp(
    ANDROID_RE + '|' +
    BLACKBERRY_RE + '|' +
    FIREFOXOS_RE + '|' +
    IPHONE_RE + '|' +
    IPAD_RE + '|' +
    WEBOS
  );

  var isMobile = null;

  var objectTypes = {};

  // Map object types
  Kimbo.forEach([ 'Array', 'Boolean', 'Date', 'Error', 'Function',
    'Number', 'Object', 'RegExp', 'String'
  ], function (type) {
      objectTypes['[object ' + type + ']'] = type.toLowerCase();
    }
  );

  Kimbo.extend({
    /*\
     * $.typeOf
     [ method ]
     * Determine the internal JavaScript [[Class]] of an object.
     > Parameters
     - obj (object) Object to get its [[Class]] type.
     = (string) Type of the object.
     > Usage
     | $.typeOf('i am a string'); // 'string'
     | $.typeOf(/(\.regexp?)/); // 'regexp'
     | $.typeOf(null); // 'null'
     | $.typeOf(undefined); // 'undefined'
     | $.typeOf(window.notDefined); // 'undefined'
     | $.typeOf(function () {}); // 'function'
     | $.typeOf({key: 'value'}); // 'object'
     | $.typeOf(true); // 'boolean'
     | $.typeOf([]); // 'array'
     | $.typeOf(new Date()); // 'date'
     | $.typeOf(3); // 'number'
    \*/
    typeOf: function (obj) {
      var type;

      if (obj === null || obj === undefined) {
        type = String(obj);

      } else {
        type = (objectTypes[Object.prototype.toString.call(obj)] || 'object');
      }

      return type;
    },

    /*\
     * $.isArray
     [ method ]
     * Determine if the parameter passed is an array object.
     > Parameters
     - obj (object) Object to test if its an array.
     = (boolean) According wether or not it is an array object.
     > Usage
     | $.isArray([]); // True
     | $.isArray({}); // False
     | $.isArray('test'); // False
    \*/
    isArray: Array.isArray,

    /*\
     * $.isNumeric
     [ method ]
     * Determine if the parameter passed is an number.
     > Parameters
     - obj (object) Object to test if its a number.
     = (boolean) According wether or not it is a number.
     > Usage
     | $.isNumeric(3); // True
     | $.isNumeric('3'); // False
    \*/
    isNumeric: function (obj) {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    /*\
     * $.isWindow
     [ method ]
     * Determine if the parameter passed is the window object.
     > Parameters
     - obj (object) Object to test if its the window object.
     = (boolean) According wether or not it is the window object.
     > Usage
     | $.isWindow(window); // True
     | $.isWindow({ window: window }); // False
    \*/
    isWindow: function (obj) {
      return obj && obj === obj.window;
    },

    /*\
     * $.isEmptyObject
     [ method ]
     * Determine if the parameter passed is an empty object.
     > Parameters
     - obj (object) Object to test if its an empty object.
     = (boolean) According wether or not it is an empty object.
     > Usage
     | $.isEmptyObject({}); // True
     | $.isEmptyObject([]); // True
     | $.isEmptyObject([1, 2]); // False
    \*/
    isEmptyObject: function (obj) {
      var key;

      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }

      return true;
    },

    /*\
     * $.isMobile
     [ method ]
     * Determine if the current platform is a mobile device, (otherwise is a desktop browser).
     > Parameters
     = (boolean) According wether or not is a mobile device.
     > Usage
     | $.isMobile(); // False
    \*/
    isMobile: function () {

      // Check only once for the current browser
      if (isMobile === null) {
        isMobile = MOBILE_OS_RE.test(navigator.userAgent);
      }

      return isMobile;
    },

    /*\
     * $.parseJSON
     [ method ]
     * Parses a well-formed JSON string and returns the resulting JavaScript object.
     > Parameters
     - data (string) The JSON string to parse.
     = (object) A JavaScript object.
     > Usage
     | var obj = $.parseJSON('{"name":"Denis"}');
     | console.log(obj.name === 'Denis'); // True
    \*/
    parseJSON: function (data) {

      // Use native JSON parser
      if (data && Kimbo.isString(data)) {
        return window.JSON.parse(data);
      }
    },

    /*\
     * $.parseXML
     [ method ]
     * Parses a string into an XML document.
     > Parameters
     - data (string) The JSON string to parse.
     = (object) A JavaScript object.
     > Usage
     | var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>"
     | var xmlDoc = $.parseXML(xml);
     | $(xmlDoc).find('title'); // 'RSS Title'
    \*/
    parseXML: function (data) {

      // Use native XML (DOM) parser
      var domparser;
      var xml;

      if (data && Kimbo.isString(data)) {
        domparser = new window.DOMParser();
        xml = domparser.parseFromString(data, 'text/xml');

        if (xml.getElementsByTagName('parsererror').length) {
          throw new Error('Invalid XML: ' + data);
        }

        return xml;
      }
    },

    /*\
     * $.map
     [ method ]
     * Translate all items in an array or object to new array of items.
     > Parameters
     - obj (array|object) The Array or Object to translate.
     = (array) A new array.
     > Usage
     | var arr = ['a', 'b', 'c'];
     | arr = $.map(arr, function (element, index) {
     |   return element.toUpperCase() + index;
     | });
     | console.log(arr); // ['A0', 'B1', 'C2']
     * Or wit an object
     | var obj = {a: 'a', b: 'b', c: 'c'};
     | obj = $.map(arr, function (key, value) {
     |   return key + ': ' + value.toUpperCase();
     | });
     | console.log(obj); // ['a: A', 'b: B', 'c: C']
    \*/
    map: function (obj, callback) {
      var values = [];

      if (obj) {
        Kimbo.forEach(obj, function (key, val) {
          var value = callback(key, val);

          if (value !== null && value !== undefined) {
            values.push(value);
          }
        });
      }

      // Flatten any nested arrays
      return values.concat.apply([], values);
    },

    /*\
     * $.makeArray
     [ method ]
     * Create an Array from the given object
     > Parameters
     - obj (array|object) The Array or Object to make an array from.
     = (array) A new array.
     > Usage
     | var lis = $('li'); // Kimbo object
     | var arr = $.makeArray(lis);
     |
     | console.log($.isArray(lis)); // False
     | console.log($.isArray(arr)); // True
    \*/
    makeArray: function (obj, results) {
      results = results || [];

      if (obj) {
        if (Kimbo.isArray(obj) || (obj instanceof Kimbo) || obj instanceof window.NodeList) {
          results = Kimbo.merge(results, obj);
        } else {
          _.push.call(results, obj);
        }
      }

      return results;
    },

    /*\
     * $.merge
     [ method ]
     * Merge the contents of two arrays into the first array passed.
     > Parameters
     - first (array) The first array to merge the contents of the second.
     - second (array|string) The second array to merge into the first.
     = (array) The first array merged with the second.
     > Usage
     | $.merge(['a', 'b'], ['c', 'd']);
     * Result:
     | ['a', 'b', 'c', 'd']
    \*/
    merge: function (first, second) {

      // Concat is very fast, use it if we can
      if (Kimbo.isArray(first)) {
        first = first.concat(second);

      // Kimbo object, do a consecutive push
      } else {
        _.push.apply(first, _.slice.call(second));
      }

      return first;
    },

    /*\
     * $.camelCase
     [ method ]
     * Camelize any dashed separated string
     > Parameters
     - str (string) A dashed separated string value to transform into camelCase.
     = (string) camelCase string
     > Usage
     | $.camelCase('background-color');
     * Result:
     | 'backgroundColor'
    \*/
    camelCase: function (str) {
      return str.replace(/-+(.)?/g, function (wholeMatch, character) {
        return character.toUpperCase();
      });
    },

    /*\
     * $.isFunction
     [ method ]
     * Determine if the parameter passed is a Javascript function object.
     > Parameters
     - obj (object) Object to test if its a function.
     = (boolean) According wether or not it is a function.
     > Usage
     | var myFunction = function () {};
     | $.isFunction(myFunction); // True
     | var something = ['lala', 'jojo'];
     | $.isFunction(something); // False
    \*/
    isFunction: function (obj) {
      return Kimbo.typeOf(obj) === 'function';
    },

    /*\
     * $.isObject
     [ method ]
     * Determine if the parameter passed is a Javascript plain object.
     > Parameters
     - obj (object) Object to test if its a plain object.
     = (boolean) According wether or not it is a plain object.
     > Usage
     | $.isObject({}); // True
     | $.isObject([]); // False
     | $.isObject('test'); // False
    \*/
    isObject: function (obj) {
      return Kimbo.typeOf(obj) === 'object';
    },

    /*\
     * $.isString
     [ method ]
     * Determine if the parameter passed is a string.
     > Parameters
     - obj (object) Object to test if its a string.
     = (boolean) According wether or not it is a string.
     > Usage
     | $.isString('test'); // True
     | $.isString({ name: 'asd' }); // False
    \*/
    isString: function (obj) {
      return Kimbo.typeOf(obj) === 'string';
    },

    /*\
     * $.isBoolean
     [ method ]
     * Determine if the parameter passed is boolean.
     > Parameters
     - obj (object) Object to test if its boolean..
     = (boolean) According wether or not it is boolean.
     > Usage
     | $.isBoolean(false); // True
     | $.isBoolean(3); // False
    \*/
    isBoolean: function (obj) {
      return Kimbo.typeOf(obj) === 'boolean';
    }
  });

  // Save reference to Kimbo wrapped document as the default context
  _.rootContext = _.kimbo(_.rootContext);
});


Kimbo.define('events', function (_) {

  'use strict';

  var query = Kimbo.require('query');

  var _guid = 1;

  var MOUSE_EVENT_RE = /^(?:mouse|menu)|click/;

  var KEY_EVENT_RE = /^key/;

  var DEFAULT_EVENT_PROPS = [
    'altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'defaultPrevented', 'eventPhase',
    'metaKey', 'relatedTarget', 'shiftKey', 'target', 'timeStamp', 'type', 'view', 'which'
  ];

  var MOUSE_EVENT_PROPS = [
    'button', 'buttons', 'clientX', 'clientY', 'fromElement',
    'offsetX', 'offsetY', 'screenX', 'screenY', 'toElement'
  ];

  var KEY_EVENT_PROPS = ['char', 'charCode', 'key', 'keyCode'];

  // Gestures fallback for not mobile environment
  var GESTURES_FALLBACK = Kimbo.isMobile() ? {} : {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    touch: 'click',
    doubletap: 'dblclick',
    orientationchange: 'resize'
  };

  var handlersHash = {};
  var fixEventProps = {};
  var specialEvents = {};

  var _fixEvent = function (event) {
    var originalEvent, eventProps, props;

    // Already fixed
    if (event[Kimbo.ref]) {
      return event;
    }

    // Get event properties
    originalEvent = event;
    eventProps = fixEventProps[event.type] || [];
    props = DEFAULT_EVENT_PROPS.concat(eventProps);

    // Create a new event writable custom event object
    event = new Kimbo.Event(originalEvent);

    // Set event props to Kimbo.Event object
    Kimbo.forEach(props, function (prop) {
      event[prop] = originalEvent[prop];
    });

    return event;
  };

  // Return element id
  var _getElementId = function (element) {
    return element._guid || (element._guid = _guid++);
  };

  // Get element handlers for the specified type
  var _getHandlers = function (elementId, type) {
    var events = ((handlersHash[elementId] || {}).events || {});

    return (type ? events[type] : events) || [];
  };

  // Quick is() to check if event target matches when events are delegated
  var _is = function (target, selector, element) {
    return (target.nodeName.toLowerCase() === selector && _.kimbo(target).closest(selector, element)[0]);
  };

  var _returnFalse = function () {
    return false;
  };

  var _returnTrue = function () {
    return true;
  };

  // Register events to dom elements
  var _addEvent = function (element, type, callback, data, selector) {

    // TODO: element should use Kimbo.ref and the handler the _guid
    var elementId = _getElementId(element);
    var elementHandlers = handlersHash[elementId];
    var origType = type;
    var events, handlers, handleObj, handler;

    // Could be a special type like mouseenter/mouseleave
    type = specialEvents[type] ? specialEvents[type].origType : type;

    // Create hash for this element if first init
    if (!elementHandlers) {
      handlersHash[elementId] = elementHandlers = {};
    }

    // Create events object if first init
    events = elementHandlers.events;
    if (!events) {
      elementHandlers.events = events = {};
    }

    // Create the handler for this element if first init
    handler = elementHandlers.handler;
    if (!handler) {
      elementHandlers.handler = handler = function () {
        return _dispatchEvent.apply(element, arguments);
      };
    }

    // Create handler object
    handleObj = {
      type: type,
      origType: origType,
      data: data,
      callback: callback,
      selector: selector
    };

    // Only add an event listener one time for each type of event
    handlers = events[type];
    if (!handlers) {

      // Array of events for the current type
      handlers = events[type] = [];
      handlers.delegateCount = 0;

      // Add event
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      }
    }

    // Add to handlers hash, delegates first
    if (selector) {
      handlers.splice(handlers.delegateCount++, 0, handleObj);

    } else {
      handlers.push(handleObj);
    }
  };

  // Unregister events from dom elements
  var _removeEvent = function (element, type, callback, selector) {
    var elementId = _getElementId(element);
    var handleObj, handlers, name, i;

    if (!elementId) {
      return;
    }

    handlers = _getHandlers(elementId, type);

    // Return if no handlers for the current event type
    if (type && !handlers.length) {
      return;
    }

    // Remove all handlers if no type provided
    if (!type) {
      for (name in handlers) {
        if (handlers.hasOwnProperty(name)) {
          _removeEvent(element, name, callback, selector);
        }
      }
    }

    // Remove handlers that match
    for (i = 0; i < handlers.length; i++) {
      handleObj = handlers[i];
      if ((!callback || callback === handleObj.callback) && (!selector || selector === handleObj.selector)) {

        // Remove current handler from stack
        handlers.splice(i--, 1);

        // Decrement delegate count
        if (handleObj.selector) {
          handlers.delegateCount--;
        }
      }
    }

    // If no more events for the current type delete its hash
    if (!handlers.length) {

      // Remove event handler
      element.removeEventListener(type, handlersHash[elementId].handler, false);
      delete handlersHash[elementId].events[type];
    }

    // Remove kimbo reference if element have no more events
    // If (Kimbo.isEmptyObject(handlersHash[elementId].events)) {
    //   delete handlersHash[elementId];
    //   delete element._guid;
    // }
  };

  // Triggers a provided event type
  var _triggerEvent = function (element, type, data) {

    /* jshint validthis: true */
    var currentElement, lastElement, eventTree, elementId, event;

    // Don't do events if element is text or comment node
    // Or if there is no event type at all or type is not a string
    if ((element && (element.nodeType === 3 || element.nodeType === 8)) || !type || !Kimbo.isString(type)) {
      return this;
    }

    // Try triggering native focus and blur events
    if (type === 'focus' || type === 'blur') {
      try {
        return element[type]();
      } catch (e) {}
    }

    // Create a new writable custom event object
    event = new Kimbo.Event(type);

    // Triggered programatically
    event.isTrigger = true;

    // Set the target
    if (!event.target) {
      event.target = element;
    }

    // Include data if any
    data = data ? Kimbo.makeArray(data) : [];
    // Event goes first
    data.unshift(event);

    // Generate a stack of [element, event] to be triggered
    eventTree = [[element, type]];
    if (!Kimbo.isWindow(element)) {

      // Get all parent elements to bubble event later
      for (currentElement = element.parentNode; currentElement; currentElement = currentElement.parentNode) {
        eventTree.push([currentElement, type]);
        lastElement = currentElement;
      }

      // Only add window object if we got to document (e.g., not plain obj or detached DOM)
      if (lastElement && lastElement === element.ownerDocument) {
        eventTree.push([window, type]);
      }
    }

    // Fire handlers up to the document (or the last element)
    Kimbo.forEach(eventTree, function (branch) {

      // Element
      currentElement = branch[0];

      // Type
      event.type = branch[1];

      // Get element id
      elementId = currentElement._guid;

      // If the current element has events of the specified type, dispatch them
      if (elementId && _getHandlers(elementId, type)) {
        handlersHash[elementId].handler.apply(currentElement, data);
      }
    });
  };

  // Own defined dispatchEvent()
  var _dispatchEvent = function (event) {
    /* jshint -W040 */

    // Use own event object
    event = _fixEvent(event);

    var elementId = _getElementId(this);
    var handlers = _getHandlers(elementId, event.type);
    var delegateCount = handlers.delegateCount;
    var args = _.slice.call(arguments);
    var handlerQueue = [];
    var currentElement, ret, selMatch, matches, handleObj, selector, i;

    // Set the native event to be the fixed event
    args[0] = event;

    // Save the delegate target element
    event.delegateTarget = this;

    // Get delegated handlers if any
    if (delegateCount) {

      // Go up to the dom finding the elements that matches the current selector from delegated event
      for (currentElement = event.target; currentElement !== this; currentElement = currentElement.parentNode || this) {

        // Don't do events on disabled elements
        if (currentElement.disabled !== true || event.type !== 'click') {
          selMatch = {};
          matches = [];

          // Loop throgh delegated events
          for (i = 0; i < delegateCount; i++) {

            // Get its handler
            handleObj = handlers[i];

            // Get its selector
            selector = handleObj.selector;

            if (!selMatch[selector]) {
              selMatch[selector] = _is(currentElement, selector, this);
            }

            if (selMatch[selector]) {
              matches.push(handleObj);
            }
          }

          if (matches.length) {
            handlerQueue.push({elem: currentElement, matches: matches});
          }
        }
      }
    }

    // Add the remaining not delegated handlers
    if (handlers.length > delegateCount) {
      handlerQueue.push({elem: this, matches: handlers.slice(delegateCount)});
    }

    // Fire callbacks queue
    Kimbo.forEach(handlerQueue, function (handler) {

      // Only fire handler if event wasnt stopped
      if (!event.isPropagationStopped()) {
        event.currentTarget = handler.elem;

        Kimbo.forEach(handler.matches, function (handleObj) {

          // Only fire bubble if not stopped
          if (!event.isImmediatePropagationStopped()) {
            event.data = handleObj.data;
            event.handleObj = handleObj;

            // Call original callback, check if its an special event first
            ret = ((specialEvents[handleObj.origType] || {}).handle || handleObj.callback).apply(handler.elem, args);

            // If callback returns false, stop the event
            if (ret === false) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        });
      }
    });

    /* jshint +W040 */
  };

  Kimbo.Event = function (event) {

    // Is event object
    if (event && event.type) {
      this.originalEvent = event;
      this.type = event.type;

      // The event may have been prevented
      // Check dom level 3 new attribute and set proper value
      if (event.defaultPrevented) {
        this.isDefaultPrevented = _returnTrue;
      } else {
        this.isDefaultPrevented = _returnFalse;
      }

    // Is event type
    } else {
      this.type = event;
    }

    // Create a timestamp if doesn't have one
    this.timeStamp = (event && event.timeStamp) || Date.now();

    // Made by kimbo, yeah
    this[Kimbo.ref] = true;
  };

  // Dom-Level-3-Events compliant
  Kimbo.Event.prototype = {
    isDefaultPrevented: _returnFalse,
    isPropagationStopped: _returnFalse,
    isImmediatePropagationStopped: _returnFalse,

    preventDefault: function () {
      this.isDefaultPrevented = _returnTrue;

      // Originalevent is not present when trigger is called
      if (!this.isTrigger) {
        this.originalEvent.preventDefault();
      }
    },

    stopPropagation: function () {
      this.isPropagationStopped = _returnTrue;

      if (!this.isTrigger) {
        this.originalEvent.stopPropagation();
      }
    },

    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = _returnTrue;

      if (!this.isTrigger) {
        this.originalEvent.stopImmediatePropagation();
      }
    }
  };

  Kimbo.fn.extend({
    /*\
     * $(…).on
     [ method ]
     * Add an event handler to the selected elements.
     > Parameters
     - type (string) A string name for the event to register.
     - selector (string) #optional Delegate an event providing a string selector.
     - data (any) #optional Data to be passed to the handler in `event.data` when an event is triggered.
     - callback (function) A callback function to execute when the event is triggered.
     > Usage
     * Suppose a button element:
     | <button id='btn'>click me</button>
     * Register a click event handler
     | $('#btn').on('click', function (event) {
     |   console.log('clicked!', event);
     | });
     * There are shorthands for all events for example:
     | $('#btn').click(function (event) {
     |   console.log('clicked!', event);
     | });
     * Passing some data when registering the handler:
     | $('#btn').on('click', { name: 'denis' }, function (event) {
     |   // Data passed is inside event.data
     |   console.log('name:', event.data.name);
     | });
     * Here is a list for all the shorthand methods available:
     | 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'error',
     | 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mouseenter', 'mouseleave',
     | 'mousemove', 'mouseout', 'mouseup', 'mouseover', 'resize', 'scroll', 'select', 'submit', 'unload'
    \*/
    on: function (type, selector, data, callback) {
      // Prepare the arguments

      // (type, callback)
      if (!data && !callback) {
        callback = selector;
        data = selector = undefined;

      // (type, selector, callback)
      } else if (!callback) {
        if (Kimbo.isString(selector)) {
          callback = data;
          data = undefined;

        // (type, data, callback)
        } else {
          callback = data;
          data = selector;
          selector = undefined;
        }
      }

      // Don't add events if no callback
      if (!callback) {
        return this;
      }

      type = GESTURES_FALLBACK[type] || type;

      // Add the event
      return this.each(function (el) {
        _addEvent(el, type, callback, data, selector);
      });
    },

    /*\
     * $(…).off
     [ method ]
     * Remove an event handler to the selected elements for the specified type, or all of them if no type defined.
     > Parameters
     - type (string) #optional A string name for the event to remove, or All if none specified.
     - selector (string) #optional A string selector to undelegate an event from that element.
     - callback (function) #optional A specific callback function if there are multiple registered under the same event type
     > Usage
     * Suppose a button element:
     | <button id='btn'>click me</button>
     * Register a click event handler
     | $('#btn').on('click', function (event) {
     |   console.log('clicked!', event);
     | });
     * Remove the handler
     | $('#btn').off('click');
     * Also you could specify the handler for example:
     | var firstFunction = function () { console.log('first fn'); };
     | var secondFunction = function () { console.log('second fn'); };
     | var btn = $('#btn');
     | btn.click(firstFunction);
     | btn.click(secondFunction);
     * If you want to remove the click event only for the second function, do this:
     | btn.off('click', secondFunction);
     * Or if you want to remove All handlers (click and any other attached):
     | btn.off();
    \*/
    off: function (type, selector, callback) {

      // Prepare the arguments

      // (type, callback)
      if (Kimbo.isFunction(selector)) {
        callback = selector;
        selector = undefined;
      }

      // Remove the event
      return this.each(function (el) {
        _removeEvent(el, type, callback, selector);
      });
    },

    /*\
     * $(…).trigger
     [ method ]
     * Execute all handlers attached to the matched elements for the fiven event type.
     > Parameters
     - type (string) #optional A string name for the event to remove, or All if none specified.
     - data (any) #optional Additional parameters to be passed to the handler in `event.data` when an event is triggered.
     > Usage
     * Suppose a button element:
     | <button id='btn'>click me</button>
     * Register a click event handler
     | $('#btn').on('click', function (event, data) {
     |   console.log('name', data.name);
     | });
     * Trigger the event programatically passing some data:
     | $('#btn').trigger('click', { name: 'denis' });
     | // 'name denis'
     * Allow the handler to recieve multiple data:
     | $('#btn').on('click', function (event, name, last) {
     |   console.log('name', name);
     |   console.log('last', last);
     | });
     | $('#btn').trigger('click', ['denis', 'ciccale']);
     | // Name denis
     | // Last ciccale
    \*/
    trigger: function (type, data) {
      return this.each(function (el) {
        _triggerEvent(el, type, data);
      });
    },

    /*\
     * $(…).hover
     [ method ]
     * A shortcut method to register moseenter and/or mouseleave event handlers to the matched elements.
     > Parameters
     - fnOver (function) A function to execute when the cursor enters the element.
     - fnOut (function) #optional A function to execute when the cursor leaves the element.
     > Usage
     * Suppose a div element:
     | <div id='box'></div>
     * Register hover event
     | var fnOver = function () { console.log('enter'); };
     | var fnOut = function () { console.log('leave'); };
     |
     | $('.box').hover(fnOver, fnOut);
     * When the cursor enters the `.box` element the console will log:
     | 'enter'
     * When the cursor leaves the `.box` element the console will log:
     | 'leave'
    \*/
    hover: function (fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    }
  });

  // Shortcut methods for each event type
  Kimbo.forEach(['blur', 'change', 'click', 'contextmenu', 'dblclick', 'error',
    'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove',
    'mouseout', 'mouseup', 'mouseover', 'resize', 'scroll', 'select', 'submit', 'unload'], function (type) {

    Kimbo.fn[type] = function (data, callback) {
      return arguments.length > 0 ? this.on(type, null, data, callback) : this.trigger(type);
    };

    // Set event props for the specific type
    fixEventProps[type] = KEY_EVENT_RE.test(type) ? KEY_EVENT_PROPS : MOUSE_EVENT_RE.test(type) ? MOUSE_EVENT_PROPS : null;
  });

  // Fix mouseover and mouseout events to use mouseenter mouseleave
  Kimbo.forEach({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  }, function (orig, fix) {
    specialEvents[orig] = {
      origType: fix,

      handle: function (event) {
        var target = this;
        var related = event.relatedTarget;
        var handleObj = event.handleObj;
        var ret;

        if (!related || (related !== target && !query.contains(target, related))) {
          event.type = handleObj.origType;
          ret = handleObj.callback.apply(this, arguments);
          event.type = fix;
        }

        return ret;
      }
    };
  });

});


Kimbo.define('ajax', function (_) {

  'use strict';

  var JSONP_RE = /(\=)\?(&|$)|\?\?/i;

  var MIME_TYPES = {
    html: 'text/html',
    json: 'application/json',
    script: 'text/javascript, application/javascript',
    text: 'text/plain',
    xml: 'application/xml, text/xml'
  };

  var dataParse = {
    json: Kimbo.parseJSON,
    xml: Kimbo.parseXML
  };

  var xhrCallbacks = {};

  // Success and error callbacks
  Kimbo.forEach(['success', 'error'], function (type) {
    xhrCallbacks[type] = function (res, msg, xhr, settings) {
      settings = settings || xhr;
      if (Kimbo.isFunction(settings[type])) {
        settings[type].apply(settings.context, arguments);
      }
    };
  });

  var _getResponse = function (response, type) {
    return (dataParse[type] ? dataParse[type](response) : response);
  };

  var _handleResponse = function (xhr, settings) {
    var response, contentType;

    // Set dataType if missing
    if (!settings.dataType) {
      contentType = xhr.getResponseHeader('Content-Type');

      Kimbo.forEach(MIME_TYPES, function (name, type) {
        if (type.match(contentType)) {
          settings.dataType = name;
          return false;
        }
      });

      // Fix settings headers
      _setHeaders(settings);
    }

    try {
      response = _getResponse(xhr.responseText, settings.dataType);
    } catch (e) {
      response = false;
      xhrCallbacks.error('parseerror', e, xhr, settings);
    }

    return response;
  };

  var _setHeaders = function (settings) {
    if (!settings.crossDomain && !settings.headers['X-Requested-With']) {
      settings.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    if (settings.contentType) {
      settings.headers['Content-Type'] = settings.contentType;
    }

    settings.headers.Accept = MIME_TYPES[settings.dataType] || '*/*';
  };

  var _timeout = function (xhr, settings) {
    xhr.onreadystatechange = null;
    xhr.abort();
    xhrCallbacks.error('error', 'timeout', xhr, settings);
  };

  var _createAbortTimeout = function (xhr, settings) {
    return window.setTimeout(function () {
      _timeout(xhr, settings);
    }, settings.timeout);
  };

  /*\
   * $.ajaxSettings
   [ property ]
   * Default ajax settings object.
   > Usage
   * If you want to change the global and default ajax settings, change this object properties:
   | $.ajaxSettings.error = function () {
   |   // Handle any failed ajax request in your app
   | };
   | $.ajaxSettings.timeout = 1000; // 1 second
  \*/
  Kimbo.ajaxSettings = {
    type: 'GET',
    async: true,
    success: {},
    error: {},
    context: null,
    headers: {},
    data: null,
    crossDomain: false,
    timeout: 0,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    xhr: function () {
      return new window.XMLHttpRequest();
    }
  };

  /*\
   * $.ajax
   [ method ]
   * Perform an asynchronous HTTP (Ajax) request.
   > Parameters
   - options (object) #optional An object with options
   o {
   o   url (string) Url to make the request.
   o   type (string) #optional Type of request. Could be `'GET'` or `'POST'`. Default value is `'GET'`.
   o   async (boolean) #optional Default value is `true` if you want synchronous requests set option to `false`.
   o   success (function) #optional A function that will be called if the request succeeds. Recieving (response, responseMessage, xhr, settings).
   o   error (function) #optional A function that will be called if the request fails. Recieving (response, responseMessage, xhr, settings).
   o   context (object) #optional The context in which all ajax request are made. By default the context are the settings object. Could be any DOM element.
   o   headers (object) #optional An object with additional header key/value pairs to send along with the request.
   o   data (string|object) #optional Additional data to send with the request, if it is an object is converted to a query string.
   o   xhr (function) #optional A function that returns a `new XMLHttpRequest()` object by default.
   o   crossDomain (boolean) #optional Indicate wether you want to force crossDomain requests. `false` by defualt.
   o   timeout (number) #optional Set a default timeout in milliseconds for the request.
   o   contentType (string) #optional The default and finest contentType for most cases is `'application/x-www-form-urlencoded; charset=UTF-8'`.
   o }
   = (object) The native xhr object.
   > Usage
   * Get a username passing an id to the /users url
   | $.ajax({
   |   url '/users',
   |   data: {
   |     id: 3
   |   },
   |   success: function (response, responseMessage, xhr, settings) {
   |     // Success...
   |   },
   |   error: function (response, responseMessage, xhr, settings) {
   |     // Error...
   |   }
   | });
  \*/
  Kimbo.ajax = function (options) {
    var settings = Kimbo.extend({}, Kimbo.ajaxSettings, options);
    var xhr, abortTimeout, callback;

    // Add data to url
    if (settings.data) {
      settings.url += (/\?/.test(settings.url) ? '&' : '?') +
        Kimbo.param(settings.data);
      delete settings.data;
    }

    // Set default context
    if (!settings.context) {
      settings.context = settings;
    }

    // Check if its jsonp
    if (JSONP_RE.test(settings.url)) {
      return _getJSONP(settings);
    }

    // Create new instance
    xhr = settings.xhr();

    // User specified timeout
    if (settings.timeout > 0) {
      abortTimeout = _createAbortTimeout(xhr, settings);
    }

    // On complete callback
    callback = function () {
      var response, status;

      // Request complete
      if (xhr.readyState === 4) {
        status = xhr.status;

        // Clear timeout
        window.clearTimeout(abortTimeout);

        // Scuccess
        if ((status >= 200 && status < 300) || status === 304) {
          if (settings.async) {
            response = _handleResponse(xhr, settings);
            if (response !== false) {
              xhrCallbacks.success(response, xhr, settings);
            }
          }

        // Fail
        } else {
          xhrCallbacks.error('error', xhr.statusText, xhr, settings);
        }
      }
    };

    // Listen for response
    xhr.onreadystatechange = callback;

    // Init request
    xhr.open(settings.type, settings.url, settings.async);

    // Set settings headers
    _setHeaders(settings);

    // Set xhr headers
    Kimbo.forEach(settings.headers, function (header, value) {
      xhr.setRequestHeader(header, value);
    });

    // Try to send request
    xhr.send(settings.data);

    return (settings.async) ? xhr : callback();
  };

  /*\
   * $.get
   [ method ]
   * Load data from the server using HTTP GET request.
   > Parameters
   - url (string) A string containing the URL to which the request is sent.
   - data (string|object) #optional An option string or object with data params to send to the server.
   - callback (function) A callback function to execute if the request succeeds.
   - type (string) #optional String with the type of the data to send (intelligent guess by default).
   > Usage
   | $.get('url/users.php', { id: '123' }, function (data) {
   |   // Success
   |   console.log('response:', data);
   | });
   * This method is a shorthand for the $.ajax
   | $.ajax({
   |   url: url,
   |   data: data,
   |   success: success,
   |   dataType: dataType
   | });
  \*/

  /*\
   * $.post
   [ method ]
   * Load data from the server using HTTP POST request.
   > Parameters
   - url (string) A string containing the URL to which the request is sent.
   - data (string|object) #optional An option string or object with data params to send to the server.
   - callback (function) A callback function to execute if the request succeeds.
   - type (string) #optional String with the type of the data to send (intelligent guess by default).
   > Usage
   | $.post('url/users.php', { user: 'denis', pass: '123' }, function (data) {
   |   // Success
   |   console.log('response:', data);
   | });
   * This method is a shorthand for the $.ajax
   | $.ajax({
   |   type: 'POST',
   |   url: url,
   |   data: data,
   |   success: success,
   |   dataType: dataType
   | });
  \*/
  Kimbo.forEach(['get', 'post'], function (method) {
    Kimbo[method] = function (url, data, callback, type) {

      // Prepare arguments
      if (Kimbo.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = null;
      }

      // Call ajax
      return Kimbo.ajax({
        type: method.toUpperCase(),
        url: url,
        data: data,
        success: callback,
        dataType: type
      });
    };
  });

  Kimbo.extend({
   /*\
    * $.getScript
    [ method ]
    * Load a JavaScript file from the server using a GET HTTP request, then execute it.
    > Parameters
    - url (string) A string containing the URL to which the request is sent.
    - callback (function) A callback function to execute if the request succeeds.
    > Usage
    | $.getScript('url/script.js', function (data) {
    |   // Success
    |   console.log('response:', data);
    | });
    * This method is a shorthand for the $.ajax
    | $.ajax({
    |   url: url,
    |   dataType: 'script',
    |   success: success
    | });
   \*/
    getScript: function (url, callback) {
      return Kimbo.get(url, callback, 'script');
    },

   /*\
    * $.getJSON
    [ method ]
    * Load data from the server using HTTP POST request.
    > Parameters
    - url (string) A string containing the URL to which the request is sent.
    - data (string|object) #optional An option string or object with data params to send to the server.
    - callback (function) A callback function to execute if the request succeeds.
    - type (string) #optional String with the type of the data to send (intelligent guess by default).
    > Usage
    | $.getJSON('url/test.json', { id: '2' }, function (data) {
    |   // Success
    |   console.log('response:', data);
    | });
    * This method is a shorthand for the $.ajax
    | $.ajax({
    |   url: url,
    |   dataType: 'json',
    |   success: success
    | });
    * To get json data with jsonp:
    | $.getJSON('http://search.twitter.com/search.json?callback=?', 'q=#javascript', function (data) {
    |   console.log(data);
    | });
   \*/
    getJSON: function (url, data, callback) {
      return Kimbo.get(url, data, callback, 'json');
    }
  });

  // getJSONP internal use
  var _getJSONP = function (settings) {
    var jsonpCallback = Kimbo.ref + '_' + Date.now();
    var script = _.document.createElement('script');
    var head = _.document.head;
    var xhr = {
      abort: function () {
        window.clearTimeout(abortTimeout);
        head.removeChild(script);
        delete window[jsonpCallback];
      }
    };
    var abortTimeout;

    // User specified timeout
    if (settings.timeout > 0) {
      abortTimeout = _createAbortTimeout(xhr, settings);
    }

    // Set url
    script.src = settings.url.replace(JSONP_RE, '$1' + jsonpCallback + '$2');

    // Jsonp callback
    window[jsonpCallback] = function (response) {

      // Remove script
      xhr.abort();

      // Fake xhr
      Kimbo.extend(xhr, {
        statusText: 'OK',
        status: 200,
        response: response,
        headers: settings.headers
      });

      // Success
      xhrCallbacks.success(response, xhr, settings);
    };

    // Set settings headers
    _setHeaders(settings);

    // Apend script to head to make the request
    head.appendChild(script);

    // Return fake xhr object to abort manually
    return xhr;
  };

  /*\
   * $.param
   [ method ]
   * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
   > Parameters
   - data (string|object) A string or object to serialize.
   > Usage
   | var obj = { name: 'Denis', last: 'Ciccale' };
   | var serialized = $.param(obj); // 'name=Denis&last=Ciccale'
  \*/
  Kimbo.param = function (data) {
    var params = '';

    if (Kimbo.isObject(data)) {
      Kimbo.forEach(data, function (name, value) {
        params += name + '=' + value + '&';
      });
    } else {
      params = data;
    }

    return window.encodeURIComponent(params)
      .replace(/%20/g, '+')
      .replace(/%\d[D6F]/g, window.unescape)
      .replace(/^\?|&$/g, '');
  };
});
