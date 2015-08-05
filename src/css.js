Kimbo.define('css', function () {

  'use strict';

  // Properties without 'px' at the end
  var CSS_NO_PX = {
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    zIndex: true
  };

  var iframe = null;
  var elementsDisplay = {};

  // Wrap native to extend behavoiur
  function _getComputedStyle(element, property) {

    // Support both camelCase and dashed property names
    property = property.replace(/([A-Z])/g, '-$1').toLowerCase();

    return window.getComputedStyle(element, null).getPropertyValue(property);
  }


  function _createIframe() {
    iframe = document.createElement('iframe');
    document.documentElement.appendChild(iframe);
    return iframe;
  }

  function _getActualDisplay(nodeName, doc) {
    doc = doc || document;

    var elem, display;

    // Create and append the node
    elem = doc.createElement(nodeName);
    doc.body.appendChild(elem);

    // Get display
    display = _getComputedStyle(elem, 'display');

    // Remove it from the dom
    elem.parentNode.removeChild(elem);

    return display;
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
        var nodeName = el.nodeName;
        var display = elementsDisplay[nodeName];
        var doc;

        if (!display) {
          display = _getActualDisplay(nodeName);

          // If still fails for some css rule try creating the element in an isolated iframe
          if (display === 'none' || !display) {

            // Use the already-created iframe if possible
            iframe = (iframe || _createIframe());

            doc = (iframe.contentWindow || iframe.contentDocument).document;
            doc.write('<!doctype html><html><body>');
            doc.close();
            display = _getActualDisplay(nodeName, doc);
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

      if (!this.length || (!Kimbo.isString(property) && !Kimbo.isObject(property))) {
        return this;
      }

      function _applyCss(name, value) {

        // If it's a number add 'px' except for some properties
        if (Kimbo.isNumeric(value) && !CSS_NO_PX[Kimbo.camelCase(name)]) {
          value += 'px';
        }

        // Apply styles to all elements in the set
        that.each(function (el) {
          el.style[name] = value;
        });
      }

      // Setting one property
      if (Kimbo.isString(property)) {

        // Get
        if (value === undefined) {
          return _getComputedStyle(this[0], property);

        // Set
        } else {
          _applyCss(property, value);
        }

      // Multiple properties with an object
      } else if (Kimbo.isObject(property)) {
        Kimbo.forEach(property, _applyCss);
      }

      return this;
    }
  });
});
