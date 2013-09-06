Kimbo.define('data', function () {

  'use strict';

  var cache = {};
  var dataId = 1;

  var data = {
    get: function (el, name) {
      var domCache = cache[el.__dataId];
      var value;

      // look first in cached data
      if (domCache) {
        value = domCache[name];
      }

      // if none, try dataset
      if (!value) {
        value = el.dataset[name];
        this.set(el, name, value);
      }

      return value;
    },
    set: function (el, name, value) {
      var domData = el.__dataId;
      var domCache;

      if (!domData) {
        domData = el.__dataId = dataId++;
      }

      domCache = cache[domData];
      if (!domCache) {
        domCache = cache[domData] = {};
      }

      // set data
      domCache[name] = value;
    },
    remove: function (el, name) {
      if (name === undefined) {
        cache[el.__dataId] = {};
      } else {
        delete cache[el.__dataId][name];
      }
    }
  };

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
        return data.get(this[0], name);
      } else {
        return this.each(function (el) {
          data.set(el, name, value);
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
      if (!this.length) {
        return this;
      }

      name = name && Kimbo.camelCase(name);

      return this.each(function (el) {
        data.remove(el, name);
      });
    }
  });

  return data;
});
