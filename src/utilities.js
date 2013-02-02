var objectTypes = {},
  mobile_os = {
    Android: /(Android)\s+([\d.]+)/,
    Blackberry: /(BlackBerry|BB10|Playbook).*Version\/([\d.]+)/,
    FirefoxOS: /(Mozilla).*Mobile[^\/]*\/([\d\.]*)/,
    ipad: /(iPad).*OS\s([\d_]+)/,
    iphone: /(iPhone\sOS)\s([\d_]+)/,
    webOS: /(web|hpw)OS[\s\/]([\d.]+)/
  },
  isMobile = null;

// map object types
Kimbo.forEach(['Array', 'Boolean', 'Date', 'Function', 'Number', 'Object', 'RegExp', 'String'], function (type) {
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
    return obj === null || obj === undefined ? String(obj) : objectTypes[Object.prototype.toString.call(obj)] || 'object';
  },

  /*\
   * $.isArray
   [ method ]
   * Determine if the parameter passed is an array object.
   > Parameters
   - obj (object) Object to test if its an array.
   = (boolean) According wether or not it is an array object.
   > Usage
   | $.isArray([]); // true
   | $.isArray({}); // false
   | $.isArray('test'); // false
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
   | $.isNumeric(3); // true
   | $.isNumeric('3'); // false
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
   | $.isWindow(window); // true
   | $.isWindow({ window: window }); // false
  \*/
  isWindow: function (obj) {
    return obj && obj === obj.window;
  },

  /*\
   * $.isKimbo
   [ method ]
   * Determine if the parameter passed is a Kimbo object.
   > Parameters
   - obj (object) Object to test if its a Kimbo object.
   = (boolean) According wether or not it is a Kimbo object.
   > Usage
   | $.isKimbo($('p')); // true
   | $.isKimbo(jQuery('p')); // false
  \*/
  isKimbo: function (obj) {
    return obj instanceof Kimbo;
  },

  /*\
   * $.isEmptyObject
   [ method ]
   * Determine if the parameter passed is an empty object.
   > Parameters
   - obj (object) Object to test if its an empty object.
   = (boolean) According wether or not it is an empty object.
   > Usage
   | $.isEmptyObject({}); // true
   | $.isEmptyObject([]); // true
   | $.isEmptyObject([1, 2]); // false
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
   | $.isMobile(); // false
  \*/
  isMobile: function () {
    if (isMobile === null) {
      isMobile = false;
      Kimbo.forEach(mobile_os, function (name, regex) {
        if (regex.test(navigator.userAgent)) {
          // set to true and break the loop
          return !(isMobile = true);
        }
      });
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
   | console.log(obj.name === 'Denis'); // true
  \*/
  parseJSON: function (data) {
    // use native JSON parser
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
    // use native XML (DOM) parser
    var domparser, xml;

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
    var values = [], value;

    if (obj) {
      Kimbo.forEach(obj, function (key, val) {
        value = callback(key, val);

        if (value !== null && value !== undefined) {
          values.push(value);
        }
      });
    }

    // flatten any nested arrays
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
   | console.log($.isArray(lis)); // false
   | console.log($.isArray(arr)); // true
  \*/
  makeArray: function (obj, results) {
    results = results || [];

    if (obj) {
      if (Kimbo.isArray(obj) || Kimbo.isKimbo(obj) || obj instanceof NodeList) {
        results = Kimbo.merge(results, obj);
      } else {
        push.call(results, obj);
      }
    }

    return results;
  },

  /*\
   * $.makeArray
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
    var l = second.length,
      i = first.length,
      j = 0;

    // concat is very fast, use it if we can
    if (Kimbo.isArray(first)) {
      first = first.concat(second);

    // Kimbo object, just loop merge
    } else {
      for (; j < l; j++) {
        first[i++] = second[j];
      }
      first.length = i;
    }

    return first;
  },

  // camelize any dashed separated string
  /*\
   * $.camelCase
   [ method ]
   * Camelize any fashed separated string
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

  // unique reference for the current instance of Kimbo
  ref: 'kimbo' + ('1' + Math.random()).replace(/\D/g, '')
});

/*\
 * $.isFunction
 [ method ]
 * Determine if the parameter passed is a Javascript function object.
 > Parameters
 - obj (object) Object to test if its a function.
 = (boolean) According wether or not it is a function.
 > Usage
 | var myFunction = function () {};
 | $.isFunction(myFunction); // true
 | var something = ['lala', 'jojo'];
 | $.isFunction(something); // false
\*/

/*\
 * $.isObject
 [ method ]
 * Determine if the parameter passed is a Javascript plain object.
 > Parameters
 - obj (object) Object to test if its a plain object.
 = (boolean) According wether or not it is a plain object.
 > Usage
 | $.isObject({}); // true
 | $.isObject([]); // false
 | $.isObject('test'); // false
\*/

/*\
 * $.isString
 [ method ]
 * Determine if the parameter passed is a string.
 > Parameters
 - obj (object) Object to test if its a string.
 = (boolean) According wether or not it is a string.
 > Usage
 | $.isString('test'); // true
 | $.isString({ name: 'asd' }); // false
\*/

/*\
 * $.isBoolean
 [ method ]
 * Determine if the parameter passed is boolean.
 > Parameters
 - obj (object) Object to test if its boolean..
 = (boolean) According wether or not it is boolean.
 > Usage
 | $.isBoolean(false); // true
 | $.isBoolean(3); // false
\*/
Kimbo.forEach(['Function', 'Object', 'String', 'Boolean'], function (method) {
  var m = method.toLowerCase();
  Kimbo['is' + method] = function (obj) {
    return Kimbo.typeOf(obj) === m;
  };
});

// save reference to document
rootContext = Kimbo(document);
