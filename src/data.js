Kimbo.define('data', function () {

  'use strict';

  var cache = {};
  var dataId = 1;

  var data = {
    get: function (el, key) {
      var domCache = cache[el.__dataId];
      var value;

      // look first in cached data
      if (domCache) {
        value = domCache[key];

      // if none, try dataset
      } else {
        value = el.dataset[key];
        if (value) {
          this.set(el, key, value);
        }
      }

      return value;
    },
    set: function (el, key, value) {
      var domData = el.__dataId;
      var domCache;

      if (!domData) {
        domData = el.__dataId = dataId++;
      }

      domCache = cache[domData];
      if (!domCache) {
        domCache = cache[domData] = {};
      }

      domCache[key] = value;
    },
    remove: function (el, key) {
      if (key === undefined) {
        cache[el.__dataId] = {};
      } else {
        delete cache[el.__dataId][key];
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

      if (value === undefined) {
        return data.get(this[0], key);
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
     | $('#panel').data('isOpen'); // undefined
    \*/
    removeData: function (key) {
      if (!this.length) {
        return this;
      }

      key = key && Kimbo.camelCase(key);

      return this.each(function (el) {
        data.remove(el, key);
      });
    }
  });

  return data;
});
