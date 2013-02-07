// properties without 'px' at the end
var cssNumber = { fontWeight: true, lineHeight: true, opacity: true, zIndex: true },
  r_space = /\s+/;

// user native classList
function _hasClass(elem, name) {
  return (elem.nodeType === 1 && elem.classList.contains(name));
}

// wrap native to extend behavoiur
function _getComputedStyle(element, property) {
  // support both camelCase and dashed property names
  property = property.replace(/([A-Z])/g, '-$1').toLowerCase();
  return window.getComputedStyle(element, null).getPropertyValue(property);
}

var _data = (function() {
  var cache = {},
    data_id = 1;

  return {
    get: function(dom, name) {
      var dom_cache = cache[dom.__data],
        value;

      // look first in cached data
      if (dom_cache) {
        value = dom_cache[name];
      }

      // if none, try dataset
      if (!value) {
        value = dom.dataset[name];
        this.set(dom, name, value);
      }

      return value;
    },

    set: function (dom, name, value) {
      var dom_data = dom.__data,
        dom_cache;

      if (!dom_data) {
        dom_data = dom.__data = data_id++;
      }

      dom_cache = cache[dom_data];
      if (!dom_cache) {
        dom_cache = cache[dom_data] = {};
      }

      // set data
      dom_cache[name] = value;
    },

    remove: function (dom, name) {
      delete cache[dom.__data][name];
      if (Kimbo.isEmptyObject(cache[dom.__data])) {
        delete cache[dom.__data];
        delete dom.__data;
      }
    }
  };
}());

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

// generate addClass and removeClass methods
// use native classList
// mdn: https://developer.mozilla.org/en-US/docs/DOM/element.classList
// spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/elements.html#dom-classlist
Kimbo.forEach(['add', 'remove'], function (method, i) {
  var isRemove = i > 0;

  Kimbo.fn[method + 'Class'] = function (name) {
    var classNames;

    if (name && Kimbo.isString(name)) {
      classNames = name.split(r_space);
      this.each(function (elem) {
        // skip comments, text, etc
        if (elem.nodeType === 1) {
          // iterate through all class names passed
          Kimbo.forEach(classNames, function (className) {
            elem.classList[method](className);
          });
        }
      });

      // remove all element classes if no classname specified
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

// generate append and prepend methods
Kimbo.forEach(['append', 'prepend'], function (method, i) {
  var isPrepend = i > 0;

  Kimbo.fn[method] = function (value) {
    var div;

    // exit if no value passed
    if (!this.length || !value) {
      return this;
    }

    // handle html string
    if (Kimbo.isString(value)) {
      // placeholder element
      div = document.createElement('div');
      div.innerHTML = value;
      value = div.firstChild;
    }

    // already a dom node or kimbo collection, just insert it
    if (value.nodeType || Kimbo.isKimbo(value)) {
      return this.each(function (elem) {
        // be sure we can append/prepend to the element
        if (this.nodeType === 1 || this.nodeType === 11) {
          Kimbo(value).each(function () {
            elem.insertBefore(this, isPrepend ? elem.firstChild : null);
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
   * $(…).data
   [ method ]
   * Store or retrieve elements dataset.
   > Parameters
   - name (string) Name of the data attribute to to set.
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
  data: function (name, value) {
    if (!this.length || !Kimbo.isString(name)) {
      return this;
    }

    name = Kimbo.camelCase(name);

    if (value === undefined) {
      return _data.get(this[0], name);
    } else {
      return this.each(function () {
        _data.set(this, name, value);
      });
    }
  },

  /*\
   * $(…).removeData
   [ method ]
   * Remove data from the element dataset.
   > Parameters
   - name (string) Name of the data attribute to to remove.
   = (object) Original matched collection.
   > Usage
   | <div id="panel" data-isOpen="true"></div>
   * Remove data associated to the panel div:
   | $('#panel').removeData('isOpen');
   * Data attribute and value was removed:
   | <div id="panel"></div>
   * data-isOpen is undefined
   | $('#panel').data('isOpen'); // undefined
  \*/
  removeData: function (name) {
    if (!this.length || !Kimbo.isString(name)) {
      return this;
    }

    name = Kimbo.camelCase(name);

    return this.each(function () {
      _data.remove(this, name);
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
        return this.length > 0 ? _getComputedStyle(this[0], property) : undefined;
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
        if (Kimbo.isNumeric(value) && !cssNumber[Kimbo.camelCase(property)]) {
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

    if (this.length && name && Kimbo.isString(name)) {
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
   * Check if the element has the class 'foo'
   | $('p').hasClass('foo'); // true
   * You could also check if it has multiple classes
   | $('p').hasClass('qwe asd'); // true
  \*/
  hasClass: function (name) {
    var has = false,
    classNames;

    if (this.length && name && Kimbo.isString(name)) {
      classNames = name.trim().split(r_space);
      this.each(function (elem) {
        // classList.contains only accepts one class parameter
        Kimbo.forEach(classNames, function (name) {
          has = _hasClass(elem, name);
          // if one doesn't exists break the loop and return false
          if (!has) {
            return false;
          }
        });
      });
    }

    return has;
  },

  clone: function () {
    var res = [];
    this.each(function () {
      res.push(this.cloneNode(true));
    });
    return Kimbo(res);
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
    return this.css(dimension, value);
  };
});

