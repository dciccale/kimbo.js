Kimbo.define('data', function () {

  'use strict';

  var cache = {};
  var dataId = 1;

  var data = {
    get: function (el, key) {
      var dataCache = cache[el._dataId];
      var value;

      // Look first in cached data
      if (dataCache) {
        value = dataCache[key];

      // If none, try dataset
      } else {
        value = el.dataset[key];

        // Cache the value
        if (value) {
          this.set(el, key, value);
        }
      }

      return value;
    },

    set: function (el, key, value) {
      var elementId = el._dataId || (el._dataId = dataId++);
      var dataCache = cache[elementId];

      // Create data cache for the current element if necessary
      if (!dataCache) {
        dataCache = cache[elementId] = {};
      }

      dataCache[key] = value;
    },

    remove: function (el, key) {
      var dataCache = cache[el._dataId];
      if (dataCache) {
        if (key) {
          key = Kimbo.camelCase(key);
          delete cache[el._dataId][key];
          return;
        }

        delete cache[el._dataId];
      }
    }
  };

  Kimbo.fn.extend({
    /*\
     * $(…).data
     [ method ]
     * Store or retrieve elements dataset.
     > Parameters
     - key (string) Key of the data attribute to to set.
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
    data: function (key, value) {
      if (!this.length || !Kimbo.isString(key)) {
        return this;
      }

      key = Kimbo.camelCase(key);

      // Get
      if (value === undefined) {
        return data.get(this[0], key);

      // Set
      } else {
        return this.each(function (el) {
          data.set(el, key, value);
        });
      }
    },

    /*\
     * $(…).removeData
     [ method ]
     * Remove data from the element dataset.
     > Parameters
     - key (string) Key of the data attribute to to remove.
     = (object) Original matched collection.
     > Usage
     | <div id="panel" data-isOpen="true"></div>
     * Remove data associated to the panel div:
     | $('#panel').removeData('isOpen');
     * Data attribute and value was removed:
     | <div id="panel"></div>
     * data-isOpen is undefined
     | $('#panel').data('isOpen'); // Undefined
    \*/
    removeData: function (key) {
      if (!this.length) {
        return this;
      }

      return this.each(function (el) {
        data.remove(el, key);
      });
    }
  });

  return data;
});
