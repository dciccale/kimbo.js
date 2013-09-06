Kimbo.define('css', function () {

  'use strict';

  var data = Kimbo.require('data');

  // properties without 'px' at the end
  var CSS_NO_PX = {fontWeight: true, lineHeight: true, opacity: true, zIndex: true};

  // wrap native to extend behavoiur
  function _getComputedStyle(element, property) {
    // support both camelCase and dashed property names
    property = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    return window.getComputedStyle(element, null).getPropertyValue(property);
  }

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
        var _display = data.get(el, '_display');
        el.style.display = _display || 'block';
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
        var _display = data.get(el, '_display');
        if (!_display) {
          _display = _getComputedStyle(el, 'display');
          data.set(el, '_display', _display);
        } else {
          _display = el.style.display;
        }

        // only hide if not already hidden
        if (_display !== 'none') {
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
      var that = this;
      var properties;

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
          if (Kimbo.isNumeric(value) && !CSS_NO_PX[Kimbo.camelCase(property)]) {
            value += 'px';
          }

          that.each(function (el) {
            el.style[name] = value;
          });
        });
      }

      return this;
    }
  });
});
