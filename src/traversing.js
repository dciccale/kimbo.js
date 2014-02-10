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

      // Filter collection
      var result = _filter.call(this, function (elem, i) {
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

      // Make new empty kimbo collection
      var result = _.kimbo();
      var l = this.length;

      var i, length, n, r, elems;

      // Could use Kimbo.forEach, but this is a bit faster..
      for (i = 0; i < l; i++) {
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

      if (Kimbo.isString(element)) {
        element = this.find(element)[0];
      } else if (element instanceof Kimbo) {
        element = element[0];
      }

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
      var set;

      if (selector) {
        if (Kimbo.isString(selector)) {
          set = _.kimbo(selector, context);
        } else if (selector.nodeType) {
          set = [selector];
        } else {
          set = selector;
        }

        var all = Kimbo.merge(this, set);

        return _.kimbo(all);
      }
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
