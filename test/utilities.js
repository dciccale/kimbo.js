describe('utilities', function () {
  'use strict';

  describe('typeOf()', function () {
    var MyString = String;
    var MyNumber = Number;
    var MyBoolean = Boolean;
    var MyObject = Object;

    it('Kimbo.typeOf(null) should be null', function () {
      expect($.typeOf(null)).to.equal('null');
    });

    it('Kimbo.typeOf(undefined) should be undefined', function () {
      expect($.typeOf(void 0)).to.equal('undefined');
    });

    it('Kimbo.typeOf(true) should be boolean', function () {
      expect($.typeOf(true)).to.equal('boolean');
    });

    it('Kimbo.typeOf(false) should be boolean', function () {
      expect($.typeOf(false)).to.equal('boolean');
    });

    it('Kimbo.typeOf(Boolean(true)) should be boolean', function () {
      expect($.typeOf(Boolean(true))).to.equal('boolean');
    });

    it('Kimbo.typeOf(0) should be number', function () {
      expect($.typeOf(0)).to.equal('number');
    });

    it('Kimbo.typeOf(1) should be number', function () {
      expect($.typeOf(1)).to.equal('number');
    });

    it('Kimbo.typeOf(Number(1)) should be number', function () {
      expect($.typeOf(Number(1))).to.equal('number');
    });

    it('Kimbo.typeOf("") should be string', function () {
      expect($.typeOf('')).to.equal('string');
    });

    it('Kimbo.typeOf("a") should be string', function () {
      expect($.typeOf('a')).to.equal('string');
    });

    it('Kimbo.typeOf(String("a")) should be string', function () {
      expect($.typeOf(String('a'))).to.equal('string');
    });

    it('Kimbo.typeOf({}) should be object', function () {
      expect($.typeOf({})).to.equal('object');
    });

    it('Kimbo.typeOf(/foo/) should be regexp', function () {
      expect($.typeOf(/foo/)).to.equal('regexp');
    });

    it('Kimbo.typeOf(new RegExp("asdf")) should be regexp', function () {
      expect($.typeOf(new RegExp('asdf'))).to.equal('regexp');
    });

    it('Kimbo.typeOf([1]) should be array', function () {
      expect($.typeOf([1])).to.equal('array');
    });

    it('Kimbo.typeOf(new Date()) should be date', function () {
      expect($.typeOf(new Date())).to.equal('date');
    });

    /* jshint -W054 */
    it('Kimbo.typeOf(new Function("return")) should be function', function () {
      expect($.typeOf(new Function('return'))).to.equal('function');
    });

    /* jshint +W054 */
    it('Kimbo.typeOf(function (){}) should be function', function () {
      expect($.typeOf(function () {})).to.equal('function');
    });

    it('Kimbo.typeOf(new Error()) should be error', function () {
      expect($.typeOf(new Error())).to.equal('error');
    });

    it('Kimbo.typeOf(window) should be object', function () {
      expect($.typeOf(window)).to.equal('object');
    });

    it('Kimbo.typeOf(document) should be object', function () {
      expect($.typeOf(document)).to.equal('object');
    });

    it('Kimbo.typeOf(document.body) should be object', function () {
      expect($.typeOf(document.body)).to.equal('object');
    });

    it('Kimbo.typeOf(document.createTextNode("foo")) should be object', function () {
      expect($.typeOf(document.createTextNode('foo'))).to.equal('object');
    });

    it('Kimbo.typeOf(document.getElementsByTagName(' * ')) should be object', function () {
      expect($.typeOf(document.getElementsByTagName('*'))).to.equal('object');
    });

    it('Kimbo.typeOf(new MyBoolean(true)) should be boolean', function () {
      expect($.typeOf(new MyBoolean(true))).to.equal('boolean');
    });

    it('Kimbo.typeOf(new Number(1)) should be number', function () {
      expect($.typeOf(new MyNumber(1))).to.equal('number');
    });

    it('Kimbo.typeOf(new Number(1)) should be string', function () {
      expect($.typeOf(new MyString('a'))).to.equal('string');
    });

    it('Kimbo.typeOf(new Object()) should be object', function () {
      expect($.typeOf(new MyObject())).to.equal('object');
    });
  });

  describe('isArray()', function () {
    it('Kimbo.isArray([]) should be true', function () {
      expect($.isArray([])).to.equal(true);
    });
  });

  describe('isNumeric()', function () {
    it('Negative integer string', function () {
      expect($.isNumeric('-10')).to.equal(true);
    });

    it('Zero string', function () {
      expect($.isNumeric('0')).to.equal(true);
    });

    it('Positive integer string', function () {
      expect($.isNumeric('5')).to.equal(true);
    });

    it('Negative integer number', function () {
      expect($.isNumeric(-16)).to.equal(true);
    });

    it('Zero integer number', function () {
      expect($.isNumeric(0)).to.equal(true);
    });

    it('Positive integer number', function () {
      expect($.isNumeric(32)).to.equal(true);
    });

    it('Octal integer literal string', function () {
      expect($.isNumeric('040')).to.equal(true);
    });

    it('Hexadecimal integer literal string', function () {
      expect($.isNumeric('0xFF')).to.equal(true);
    });

    it('Hexadecimal integer literal', function () {
      expect($.isNumeric(0xFFF)).to.equal(true);
    });

    it('Negative floating point string', function () {
      expect($.isNumeric('-1.6')).to.equal(true);
    });

    it('Positive floating point string', function () {
      expect($.isNumeric('4.536')).to.equal(true);
    });

    it('Negative floating point number', function () {
      expect($.isNumeric(-2.6)).to.equal(true);
    });

    it('Positive floating point number', function () {
      expect($.isNumeric(3.1415)).to.equal(true);
    });

    it('Exponential notation', function () {
      expect($.isNumeric(8e5)).to.equal(true);
    });

    it('Exponential notation string', function () {
      expect($.isNumeric('123e-2')).to.equal(true);
    });

    it('Empty string', function () {
      expect($.isNumeric('')).to.equal(false);
    });

    it('Whitespace characters string', function () {
      expect($.isNumeric('        ')).to.equal(false);
    });

    it('Tab characters string', function () {
      expect($.isNumeric('\t\t')).to.equal(false);
    });

    it('Alphanumeric character string', function () {
      expect($.isNumeric('abcdefghijklm1234567890')).to.equal(false);
    });

    it('Non-numeric character string', function () {
      expect($.isNumeric('xabcdefx')).to.equal(false);
    });

    it('Boolean true literal', function () {
      expect($.isNumeric(true)).to.equal(false);
    });

    it('Boolean false literal', function () {
      expect($.isNumeric(false)).to.equal(false);
    });

    it('Number with preceding non-numeric characters', function () {
      expect($.isNumeric('bcfed5.2')).to.equal(false);
    });

    it('Number with trailling non-numeric characters', function () {
      expect($.isNumeric('7.2acdgs')).to.equal(false);
    });

    it('Undefined value', function () {
      expect($.isNumeric(void 0)).to.equal(false);
    });

    it('Null value', function () {
      expect($.isNumeric(null)).to.equal(false);
    });

    it('NaN value', function () {
      expect($.isNumeric(NaN)).to.equal(false);
    });

    it('Infinity primitive', function () {
      expect($.isNumeric(Infinity)).to.equal(false);
    });

    it('Positive Infinity', function () {
      expect($.isNumeric(Number.POSITIVE_INFINITY)).to.equal(false);
    });

    it('Negative Infinity', function () {
      expect($.isNumeric(Number.NEGATIVE_INFINITY)).to.equal(false);
    });

    it('Empty object', function () {
      expect($.isNumeric({})).to.equal(false);
    });

    it('Instance of a function', function () {
      expect($.isNumeric(function () {})).to.equal(false);
    });

    it('Instance of a Date', function () {
      expect($.isNumeric(new Date())).to.equal(false);
    });

    it('Instance of a function', function () {
      expect($.isNumeric(function () {})).to.equal(false);
    });
  });

  describe('isWindow()', function () {
    it('Kimbo.isWindow on window object should be true', function () {
      expect($.isWindow(window)).to.equal(true);
    });
  });

  describe('isEmptyObject()', function () {
    it('Kimbo.isEmptyObject on emptyobject literal should be true', function () {
      expect($.isEmptyObject({})).to.equal(true);
    });

    it('Kimbo.isEmptyObject on non-emptyobject literal should be false', function () {
      expect($.isEmptyObject({
        a: 'a'
      })).to.equal(false);
    });
  });

  describe('isMobile()', function () {
    it('Kimbo.isMobile() should return false in desktop environments', function () {
      expect($.isMobile()).to.equal(false);
    });
  });

  describe('parseJSON()', function () {
    it('should parse a json string', function () {
      expect($.parseJSON('{"a": 1}')).to.deep.equal({'a': 1});
    });

    it('should return undefined if no data passed', function () {
      expect($.parseJSON()).to.equal(void 0);
    });
  });

  describe('parseXML()', function () {
    it('should parse a well formed xml string', function () {
      var tmp, xml;
      xml = $.parseXML('<p>Test <strong>parse</strong> xml string</p>');
      tmp = xml.getElementsByTagName('p')[0];
      expect(!!tmp, '<p> present in document');
      tmp = tmp.getElementsByTagName('strong')[0];
      expect(!!tmp, '<strong> present in document');
    });

    it('should fail parsing a not well formed xml string', function () {
      var e, xml;
      try {
        xml = $.parseXML('<p>Test <strong>parse</strong> bad xml string');
      } catch (_error) {
        e = _error;
        expect(e.message, 'Invalid XML: <p>Test <strong>parse</strong> xml string');
      }
    });
  });

  describe('map()', function () {
    it('should map values', function () {
      var values = ['v1', 'v2'];
      var mappedValues = Kimbo.map(values, function (v) {
        return v + '-mapped';
      });
      Kimbo.forEach(mappedValues, function (v, i) {
        expect(v).to.equal(values[i] + '-mapped');
      });
    });

    it('should return empty array if no values passed', function () {
      var ar = Kimbo.map();
      expect(ar.length).to.equal(0);
      expect(Kimbo.typeOf(ar)).to.equal('array');
    });

    it('should skip undefined or null values', function () {
      var ar = [undefined, 'val', null];
      var mappedAr = Kimbo.map(ar, function (v) { return v; });

      expect(mappedAr.length).to.equal(1);
      expect(mappedAr[0]).to.equal(ar[1]);
    });
  });

  describe('merge()', function () {
    it('should merge two arrays', function () {
      var ar1 = ['one'];
      var ar2 = ['two'];
      expect(Kimbo.merge(ar1, ar2)).to.deep.equal(['one', 'two']);
    });
  });

  describe('camelCase()', function () {
    it('should transform a dashed separated word into camelCase', function () {
      expect(Kimbo.camelCase('dashed-word')).to.deep.equal('dashedWord');
    });
  });

  describe('isObject()', function () {
    it('should check if argument is an object', function () {
      expect(Kimbo.isObject({})).to.be.true;
      expect(Kimbo.isObject([])).to.be.false;
      expect(Kimbo.isObject('test')).to.be.false;
    });
  });

  describe('isBoolean()', function () {
    it('should check if argument is a boolean', function () {
      expect(Kimbo.isBoolean(false)).to.be.true;
      expect(Kimbo.isBoolean(3)).to.be.false;
      expect(Kimbo.isBoolean('test')).to.be.false;
    });
  });
});
