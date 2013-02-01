// properties without 'px' at the end
var cssNumber = { fontWeight: true, lineHeight: true, opacity: true, zIndex: true },
  r_space = /\s+/;


// user native classList
function _hasClass(elem, name) {
  return (elem.nodeType === 1 && elem.classList.contains(name)) ? 1 : -1;
}

// wrap native to extend behavoiur
function _getComputedStyle(element, property) {
  // support both camelCase and dashed property names
  property = property.replace(/([A-Z])/g, '-$1').toLowerCase();
  return window.getComputedStyle(element, null).getPropertyValue(property);
}

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
  Kimbo.fn[ method ] = function (value) {

    // no element
    if (!this[0]) {
      return undefined;
    }

    // get
    if (value === undefined) {
      return this[0][prop];

    // set
    } else {
      return this.each(function () {
        this[prop] = value;
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
 | <p class="green">I don't want to have a class</p>
 | <script>
 | $('p').removeClass('green');
 | </script>
 * Now it's removed
 | <p>I want to be green</p>
 * You can remove multiple classes just calling removeAttr() without Parameters
 | <p class="green big width100">Remove all classes</p>
 | <script>
 | $('p').removeClass();
 | </script>
 * All classes were removed
 | <p>Remove all classes</p>
\*/

// generate addClass and removeClass methods
// use native classList
// mdn: https://developer.mozilla.org/en-US/docs/DOM/element.classList
// spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/elements.html#dom-classlist
Kimbo.forEach(['add', 'remove'], function (method) {
  Kimbo.fn[method + 'Class'] = function (name) {
    var classNames;

    if (name && Kimbo.isString(name)) {
      classNames = name.split(r_space);
      this.each(function (elem) {
        // only "actual" nodes (skip comments, text, etc)
        if (elem.nodeType === 1) {
          Kimbo.forEach(classNames, function (className) {
            // call add/remove (native check before calling the function)
            elem.classList[ method ](className);
          });
        }
      });

    // remove all element classes if no classname specified
    } else if (!name && method === 'remove') {
      this.removeAttr('class');
    }

    return this;
  };
});

// insertBefore helper
function _insertBefore(elem, value, isPrepend) {
  if (isPrepend) {
    elem.insertBefore(value, elem.firstChild);
  } else {
    elem.insertBefore(value);
  }
}

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

// generate append and prepend methods
Kimbo.forEach(['append', 'prepend'], function (method) {
  var isPrepend = method === 'prepend';

  Kimbo.fn[ method ] = function (value) {
    var div, fn;

    // quick exit if no value passed
    if (!value) {
      return this;
    }

    // handle html string
    if (Kimbo.isString(value)) {
      // placeholder element
      div = document.createElement('div');

      // prepend method
      if (isPrepend) {
        fn = function (elem) {
          div.innerHTML = value;
          _insertBefore(elem, div.firstChild, isPrepend);
        };

      // append method
      } else {
        fn = function (elem) {
          div.innerHTML = value;
          elem.appendChild(div.firstChild);
        };
      }

    // already a dom node or kimbo collection, just insert it
    } else if (value.nodeType || Kimbo.isKimbo(value)) {
      fn = function (elem) {
        // is a kimbo collection
        if (Kimbo.isKimbo(value)) {
          value.each(function () {
            _insertBefore(elem, this, isPrepend);
          });

        // single dom node
        } else {
          _insertBefore(elem, value, isPrepend);
        }
      };

    // exit if no valid input
    } else {
      return this;
    }

    return this.each(function () {
      // be sure we can append the element
      if (this.nodeType === 1 || this.nodeType === 11) {
        // call specific function passing the element
        fn(this);
      }
    });
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
    return this.each(function () {
      while (this.hasChildNodes()) {
        this.removeChild(this.childNodes[0]);
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
    return this.each(function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    });
  },

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
    return this.css('display', 'block');
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
    return this.css('display', 'none');
  },

  // TODO: extend to accept objects and functions to set values
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
   | $('a').attr('href'); // http://kimbojs.com
    * Set a new attribute
   | $('a').attr('title', 'Go to Kimbojs.com');
   * Now element has a title attribute
   | <a href="http://kimbojs.com" title="Go to Kimbojs.com">Go to Kimbojs.com</a>
  \*/
  attr: function (name, value) {
    // no elements in the collection
    if (!this.length) {
      return this;
    }

    if (Kimbo.isString(name) && value === undefined) {
      return this[0].getAttribute(name);
    } else {
      return this.each(function () {
        this.setAttribute(name, value);
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
    return this.each(function () {
      this.removeAttribute(name);
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
   | $('p').css('color', 'red'); // now the text is red
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
    var properties,
      that = this;

    if (Kimbo.isString(property)) {
      // no value to set, return current
      if (value === undefined) {
        // return undefined if no element
        if (this.length === 0) {
          return undefined;

        // get value from style dom prop when possible, or computedStyle
        } else {
          return this[0].style[property] || _getComputedStyle(this[0], property);
        }
      } else {
        // set props to aux object
        properties = {};
        properties[property] = value;
      }
    }

    // set properties
    if (properties || Kimbo.isObject(property)) {
      properties = properties || property;
      Kimbo.forEach(properties, function (name, value) {
        // if it's a number add 'px' except for some properties
        if (Kimbo.typeOf(value) === 'number' && !cssNumber[Kimbo.camelCase(property)]) {
          value += 'px';
        }

        that.each(function () {
          this.style[name] = value;
        });
      });
    }

    // return collection
    return this;
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

    if (name && Kimbo.isString(name)) {
      classNames = name.split(r_space);
      this.each(function (elem) {
        Kimbo.forEach(classNames, function (name) {
          // use custom toggle (anyway it uses classList.add/remove)
          state = Kimbo.isBoolean(state) ? state : !_hasClass(elem, name);
          Kimbo(elem)[state ? 'addClass' : 'removeClass'](name);
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
   | <script>
   | $('p').hasClass('foo');
   | </script>
   * The `p` element has the class foo so it will return `true`
   * You could also check if it has multiple classes
   | $('p').hasClass('asd foo'); // true
  \*/
  hasClass: function (name) {
    name += '';
    var has = 0, classNames = name.split(r_space);

    if (name && Kimbo.isString(name)) {
      this.each(function (elem) {
        // classList.contains only accepts one class parameter
        Kimbo.forEach(classNames, function (name) {
          has += _hasClass(elem, name);
        });

        // break the loop if it matches 100%
        if (has === classNames.length) {
          return false;
        }
      });
    }

    // return true if has the exact classes passed
    return has === classNames.length;
  }
});

// generate get/set .width() and .height() methods
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
 | $('div').width(200); // now its width is 200
 * Or passing a specific unit:
 | $('div').width('50%'); // now its width is 50%
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
 | $('div').height(200); // now its height is 200
 * Or passing a specific unit:
 | $('div').height('50%'); // now its height is 50%
\*/
Kimbo.forEach(['width', 'height'], function (dimension) {
  Kimbo.fn[dimension] = function (value) {
    if (!value) {
      return parseInt(this.css(dimension), 10);
    }
    this.css(dimension, value);
  };
});

