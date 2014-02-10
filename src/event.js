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

      // Array of handlers for the current type
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

    // If no more events for the current type remove the listener and delete its hash
    if (!handlers.length) {
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
              selMatch[selector] = _.kimbo(currentElement).is(selector);
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

  var _returnFalse = function () {
    return false;
  };

  var _returnTrue = function () {
    return true;
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

      // Original event is not present when trigger is called
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
