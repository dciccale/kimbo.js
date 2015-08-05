Kimbo.define('manipulation', function (_) {

  'use strict';

  var SPACE_RE = /\s+/;

  var BOOLEAN_ATTR = {};
  Kimbo.forEach(['multiple', 'selected', 'checked', 'disabled', 'readOnly', 'required', 'open'],
    function (value) {
      BOOLEAN_ATTR[value.toLowerCase()] = value;
    });

  // Browser native classList
  function _hasClass(el, name) {
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
      // TODO: If we are using html method make sure to remove events and data from all chilNnodes

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
    var isRemove = method === 'remove';

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
    var isPrepend = method === 'prepend';

    Kimbo.fn[method] = function (value) {
      var div;

      // Exit if no set or value passed
      if (!this.length || !value) {
        return this;
      }

      // Handle html string
      if (Kimbo.isString(value)) {

        // Placeholder element
        div = document.createElement('div');
        div.innerHTML = value.trim();
        value = div.firstChild;
      }

      // Already a dom node or kimbo collection, just insert it
      if (value.nodeType || (value instanceof Kimbo)) {
        return this.each(function (el) {

          // Be sure we can append/prepend to the element
          if (el.nodeType === 1 || el.nodeType === 11) {
            _.kimbo(value).each(function (child) {
              el.insertBefore(child, isPrepend ? el.firstChild : null);
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
      var lowercasedName = name.toLowerCase();
      var el = this[0];

      if (!this.length) {
        return this;
      }

      if (Kimbo.isString(name) && value === undefined) {
        if (BOOLEAN_ATTR[lowercasedName]) {
          return (el[name] || (el.attributes.getNamedItem(name)|| {}).specified) ? lowercasedName : undefined;
        }
        return el.getAttribute(name);
      } else {
        return this.each(function (el) {
          if (BOOLEAN_ATTR[lowercasedName]) {
            if (!!value) {
              el[name] = true;
              el.setAttribute(name, lowercasedName);
            } else {
              el[name] = false;
              el.removeAttribute(name);
            }
          } else {
            el.setAttribute(name, value);
          }
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
});
