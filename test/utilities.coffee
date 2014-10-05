describe 'utilities', ->

  describe 'typeOf()', ->

    it 'Kimbo.typeOf(null) should be null', ->
      expect($.typeOf(null)).toBe('null')

    it 'Kimbo.typeOf(undefined) should be undefined', ->
      expect($.typeOf(undefined)).toBe('undefined')

    it 'Kimbo.typeOf(true) should be boolean', ->
      expect($.typeOf(true)).toBe('boolean')

    it 'Kimbo.typeOf(false) should be boolean', ->
      expect($.typeOf(false)).toBe('boolean')

    it 'Kimbo.typeOf(Boolean(true)) should be boolean', ->
      expect($.typeOf(Boolean(true))).toBe('boolean')

    it 'Kimbo.typeOf(0) should be number', ->
      expect($.typeOf(0)).toBe('number')

    it 'Kimbo.typeOf(1) should be number', ->
      expect($.typeOf(1)).toBe('number')

    it 'Kimbo.typeOf(Number(1)) should be number', ->
      expect($.typeOf(Number(1))).toBe('number')

    it 'Kimbo.typeOf("") should be string', ->
      expect($.typeOf('')).toBe('string')

    it 'Kimbo.typeOf("a") should be string', ->
      expect($.typeOf('a')).toBe('string')

    it 'Kimbo.typeOf(String("a")) should be string', ->
      expect($.typeOf(String('a'))).toBe('string')

    it 'Kimbo.typeOf({}) should be object', ->
      expect($.typeOf({})).toBe('object')

    it 'Kimbo.typeOf(/foo/) should be regexp', ->
      expect($.typeOf(/foo/)).toBe('regexp')

    it 'Kimbo.typeOf(new RegExp("asdf")) should be regexp', ->
      expect($.typeOf(new RegExp('asdf'))).toBe('regexp')

    it 'Kimbo.typeOf([1]) should be array', ->
      expect($.typeOf([1])).toBe('array')

    it 'Kimbo.typeOf(new Date()) should be date', ->
      expect($.typeOf(new Date())).toBe('date')

    ### jshint -W054 ###
    it 'Kimbo.typeOf(new Function("return")) should be function', ->
      expect($.typeOf(new Function('return'))).toBe('function')
    ### jshint +W054 ###

    it 'Kimbo.typeOf(function(){}) should be function', ->
      expect($.typeOf(->)).toBe('function')

    it 'Kimbo.typeOf(new Error()) should be error', ->
      expect($.typeOf(new Error())).toBe('error')

    it 'Kimbo.typeOf(window) should be object', ->
      expect($.typeOf(window)).toBe('object')

    it 'Kimbo.typeOf(document) should be object', ->
      expect($.typeOf(document)).toBe('object')

    it 'Kimbo.typeOf(document.body) should be object', ->
      expect($.typeOf(document.body)).toBe('object')

    it 'Kimbo.typeOf(document.createTextNode("foo")) should be object', ->
      expect($.typeOf(document.createTextNode('foo'))).toBe('object')

    it 'Kimbo.typeOf(document.getElementsByTagName('*')) should be object', ->
      expect($.typeOf(document.getElementsByTagName('*'))).toBe('object')

    MyString = String
    MyNumber = Number
    MyBoolean = Boolean
    MyObject = Object

    it 'Kimbo.typeOf(new MyBoolean(true)) should be boolean', ->
      expect($.typeOf(new MyBoolean(true))).toBe('boolean')

    it 'Kimbo.typeOf(new Number(1)) should be number', ->
      expect($.typeOf(new MyNumber(1))).toBe('number')

    it 'Kimbo.typeOf(new Number(1)) should be string', ->
      expect($.typeOf(new MyString('a'))).toBe('string')

    it 'Kimbo.typeOf(new Object()) should be object', ->
      expect($.typeOf(new MyObject())).toBe('object')

  describe 'isArray()', ->

    it 'Kimbo.isArray([]) should be true', ->
      expect($.isArray([])).toBe(true)

  describe 'isNumeric()', ->

    it 'Negative integer string', ->
      expect($.isNumeric('-10')).toBe(true)

    it 'Zero string', ->
      expect($.isNumeric('0')).toBe(true)

    it 'Positive integer string', ->
      expect($.isNumeric('5')).toBe(true)

    it 'Negative integer number', ->
      expect($.isNumeric(-16)).toBe(true)

    it 'Zero integer number', ->
      expect($.isNumeric(0)).toBe(true)

    it 'Positive integer number', ->
      expect($.isNumeric(32)).toBe(true)

    it 'Octal integer literal string', ->
      expect($.isNumeric('040')).toBe(true)

    it 'Hexadecimal integer literal string', ->
      expect($.isNumeric('0xFF')).toBe(true)

    it 'Hexadecimal integer literal', ->
      expect($.isNumeric(0xFFF)).toBe(true)

    it 'Negative floating point string', ->
      expect($.isNumeric('-1.6')).toBe(true)

    it 'Positive floating point string', ->
      expect($.isNumeric('4.536')).toBe(true)

    it 'Negative floating point number', ->
      expect($.isNumeric(-2.6)).toBe(true)

    it 'Positive floating point number', ->
      expect($.isNumeric(3.1415)).toBe(true)

    it 'Exponential notation', ->
      expect($.isNumeric(8e5)).toBe(true)

    it 'Exponential notation string', ->
      expect($.isNumeric('123e-2')).toBe(true)

    it 'Empty string', ->
      expect($.isNumeric('')).toBe(false)

    it 'Whitespace characters string', ->
      expect($.isNumeric('        ')).toBe(false)

    it 'Tab characters string', ->
      expect($.isNumeric('\t\t')).toBe(false)

    it 'Alphanumeric character string', ->
      expect($.isNumeric('abcdefghijklm1234567890')).toBe(false)

    it 'Non-numeric character string', ->
      expect($.isNumeric('xabcdefx')).toBe(false)

    it 'Boolean true literal', ->
      expect($.isNumeric(true)).toBe(false)

    it 'Boolean false literal', ->
      expect($.isNumeric(false)).toBe(false)

    it 'Number with preceding non-numeric characters', ->
      expect($.isNumeric('bcfed5.2')).toBe(false)

    it 'Number with trailling non-numeric characters', ->
      expect($.isNumeric('7.2acdgs')).toBe(false)

    it 'Undefined value', ->
      expect($.isNumeric(undefined)).toBe(false)

    it 'Null value', ->
      expect($.isNumeric(null)).toBe(false)

    it 'NaN value', ->
      expect($.isNumeric(NaN)).toBe(false)

    it 'Infinity primitive', ->
      expect($.isNumeric(Infinity)).toBe(false)

    it 'Positive Infinity', ->
      expect($.isNumeric(Number.POSITIVE_INFINITY)).toBe(false)

    it 'Negative Infinity', ->
      expect($.isNumeric(Number.NEGATIVE_INFINITY)).toBe(false)

    it 'Empty object', ->
      expect($.isNumeric({})).toBe(false)

    it 'Instance of a function', ->
      expect($.isNumeric(->)).toBe(false)

    it 'Instance of a Date', ->
      expect($.isNumeric(new Date())).toBe(false)

    it 'Instance of a function', ->
      expect($.isNumeric(->)).toBe(false)


  describe 'isWindow()', ->

    it 'Kimbo.isWindow on window object should be true', ->
      expect($.isWindow(window)).toBe(true)

  describe 'isEmptyObject()', ->

    it 'Kimbo.isEmptyObject on emptyobject literal should be true', ->
      expect($.isEmptyObject({})).toBe(true)

    it 'Kimbo.isEmptyObject on non-emptyobject literal should be false', ->
      expect($.isEmptyObject({a: 'a'})).toBe(false)

  describe 'isMobile()', ->
    it 'Kimbo.isMobile() should return false in desktop environments', ->
      expect($.isMobile()).toBe(false)

  describe 'parseJSON()', ->
    it 'should parse a json string', ->
      expect($.parseJSON('{"a": 1}')).toEqual({"a": 1})

  describe 'parseXML()', ->
    it 'should parse a well formed xml string', ->
      xml = $.parseXML('<p>Test <strong>parse</strong> xml string</p>')

      tmp = xml.getElementsByTagName('p')[0]
      expect(!!tmp, '<p> present in document')

      tmp = tmp.getElementsByTagName('strong')[0]
      expect(!!tmp, '<strong> present in document')

    it 'should fail parsing a not well formed xml string', ->
      try
        xml = $.parseXML('<p>Test <strong>parse</strong> bad xml string')
      catch e
        expect(e.message, 'Invalid XML: <p>Test <strong>parse</strong> xml string')

    # map
    # makeArray
    # merge
    # camelCase
