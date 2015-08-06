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
  var toString = Object.prototype.toString;

  // Map object types
  Kimbo.forEach(['Array', 'Boolean', 'Date', 'Error', 'Function',
    'Number', 'Object', 'RegExp', 'String'
  ], function (type) {
    objectTypes['[object ' + type + ']'] = type.toLowerCase();
  });

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
        type = objectTypes[toString.call(obj)];
      }

      return type || 'object';
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
      return str.replace(/-+(.)?/g, function (all, character) {
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
