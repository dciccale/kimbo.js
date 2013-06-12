Kimbo.require('data', function () {

  'use strict';

  var cache = {};
  var dataId = 1;

  function _get(dom, name) {
    var domCache = cache[dom.__data];
    var value;

    // look first in cached data
    if (domCache) {
      value = domCache[name];
    }

    // if none, try dataset
    if (!value) {
      value = dom.dataset[name];
      _set(dom, name, value);
    }

    return value;
  }

  function _set(dom, name, value) {
    var domData = dom.__data;
    var domCache;

    if (!domData) {
      domData = dom.__data = dataId++;
    }

    domCache = cache[domData];
    if (!domCache) {
      domCache = cache[domData] = {};
    }

    // set data
    domCache[name] = value;
  }

  function _remove(dom, name) {
    delete cache[dom.__data][name];
    if (Kimbo.isEmptyObject(cache[dom.__data])) {
      delete cache[dom.__data];
      delete dom.__data;
    }
  }


  Kimbo.fn.extend({
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
        return _get(this[0], name);
      } else {
        return this.each(function () {
          _set(this, name, value);
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
        _remove(this, name);
      });
    }
  });

  return {
    get: _get,
    set: _set
  };
});
