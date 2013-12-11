describe 'utilities', ->

  describe 'typeOf()', ->

    it 'Kimbo.typeOf(null) should be null', ->
      expect(Kimbo.typeOf(null)).toBe('null')

    it 'Kimbo.typeOf(undefined) should be undefined', ->
      expect(Kimbo.typeOf(undefined)).toBe('undefined')

    it 'Kimbo.typeOf(true) should be boolean', ->
      expect(Kimbo.typeOf(true)).toBe('boolean')

    it 'Kimbo.typeOf(false) should be boolean', ->
      expect(Kimbo.typeOf(false)).toBe('boolean')

    it 'Kimbo.typeOf(Boolean(true)) should be boolean', ->
      expect(Kimbo.typeOf(Boolean(true))).toBe('boolean')

    it 'Kimbo.typeOf(0) should be number', ->
      expect(Kimbo.typeOf(0)).toBe('number')

    it 'Kimbo.typeOf(1) should be number', ->
      expect(Kimbo.typeOf(1)).toBe('number')

    it 'Kimbo.typeOf(Number(1)) should be number', ->
      expect(Kimbo.typeOf(Number(1))).toBe('number')

    it 'Kimbo.typeOf("") should be string', ->
      expect(Kimbo.typeOf('')).toBe('string')

    it 'Kimbo.typeOf("a") should be string', ->
      expect(Kimbo.typeOf('a')).toBe('string')

    it 'Kimbo.typeOf(String("a")) should be string', ->
      expect(Kimbo.typeOf(String('a'))).toBe('string')

    it 'Kimbo.typeOf({}) should be object', ->
      expect(Kimbo.typeOf({})).toBe('object')

    it 'Kimbo.typeOf(/foo/) should be regexp', ->
      expect(Kimbo.typeOf(/foo/)).toBe('regexp')

    it 'Kimbo.typeOf(new RegExp("asdf")) should be regexp', ->
      expect(Kimbo.typeOf(new RegExp('asdf'))).toBe('regexp')

    it 'Kimbo.typeOf([1]) should be array', ->
      expect(Kimbo.typeOf([1])).toBe('array')

    it 'Kimbo.typeOf(new Date()) should be date', ->
      expect(Kimbo.typeOf(new Date())).toBe('date')

    ### jshint -W054 ###
    it 'Kimbo.typeOf(new Function("return")) should be function', ->
      expect(Kimbo.typeOf(new Function('return'))).toBe('function')
    ### jshint +W054 ###

    it 'Kimbo.typeOf(function(){}) should be function', ->
      expect(Kimbo.typeOf(->)).toBe('function')

    it 'Kimbo.typeOf(new Error()) should be error', ->
      expect(Kimbo.typeOf(new Error())).toBe('error')

    it 'Kimbo.typeOf(window) should be object', ->
      expect(Kimbo.typeOf(window)).toBe('object')

    it 'Kimbo.typeOf(document) should be object', ->
      expect(Kimbo.typeOf(document)).toBe('object')

    it 'Kimbo.typeOf(document.body) should be object', ->
      expect(Kimbo.typeOf(document.body)).toBe('object')

    it 'Kimbo.typeOf(document.createTextNode("foo")) should be object', ->
      expect(Kimbo.typeOf(document.createTextNode('foo'))).toBe('object')

    it 'Kimbo.typeOf(document.getElementsByTagName('*')) should be object', ->
      expect(Kimbo.typeOf(document.getElementsByTagName('*'))).toBe('object')

    MyString = String
    MyNumber = Number
    MyBoolean = Boolean
    MyObject = Object

    it 'Kimbo.typeOf(new MyBoolean(true)) should be boolean', ->
      expect(Kimbo.typeOf(new MyBoolean(true))).toBe('boolean')

    it 'Kimbo.typeOf(new Number(1)) should be number', ->
      expect(Kimbo.typeOf(new MyNumber(1))).toBe('number')

    it 'Kimbo.typeOf(new Number(1)) should be string', ->
      expect(Kimbo.typeOf(new MyString('a'))).toBe('string')

    it 'Kimbo.typeOf(new Object()) should be object', ->
      expect(Kimbo.typeOf(new MyObject())).toBe('object')

  describe 'isArray()', ->

    it 'Kimbo.isArray([]) should be true', ->
      expect(Kimbo.isArray([])).toBe(true)

  describe 'isNumeric()', ->

    it 'Negative integer string', ->
      expect(Kimbo.isNumeric('-10')).toBe(true)

    it 'Zero string', ->
      expect(Kimbo.isNumeric('0')).toBe(true)

    it 'Positive integer string', ->
      expect(Kimbo.isNumeric('5')).toBe(true)

    it 'Negative integer number', ->
      expect(Kimbo.isNumeric(-16)).toBe(true)

    it 'Zero integer number', ->
      expect(Kimbo.isNumeric(0)).toBe(true)

    it 'Positive integer number', ->
      expect(Kimbo.isNumeric(32)).toBe(true)

    it 'Octal integer literal string', ->
      expect(Kimbo.isNumeric('040')).toBe(true)

    it 'Hexadecimal integer literal string', ->
      expect(Kimbo.isNumeric('0xFF')).toBe(true)

    it 'Hexadecimal integer literal', ->
      expect(Kimbo.isNumeric(0xFFF)).toBe(true)

    it 'Negative floating point string', ->
      expect(Kimbo.isNumeric('-1.6')).toBe(true)

    it 'Positive floating point string', ->
      expect(Kimbo.isNumeric('4.536')).toBe(true)

    it 'Negative floating point number', ->
      expect(Kimbo.isNumeric(-2.6)).toBe(true)

    it 'Positive floating point number', ->
      expect(Kimbo.isNumeric(3.1415)).toBe(true)

    it 'Exponential notation', ->
      expect(Kimbo.isNumeric(8e5)).toBe(true)

    it 'Exponential notation string', ->
      expect(Kimbo.isNumeric('123e-2')).toBe(true)

    it 'Empty string', ->
      expect(Kimbo.isNumeric('')).toBe(false)

    it 'Whitespace characters string', ->
      expect(Kimbo.isNumeric('        ')).toBe(false)

    it 'Tab characters string', ->
      expect(Kimbo.isNumeric('\t\t')).toBe(false)

    it 'Alphanumeric character string', ->
      expect(Kimbo.isNumeric('abcdefghijklm1234567890')).toBe(false)

    it 'Non-numeric character string', ->
      expect(Kimbo.isNumeric('xabcdefx')).toBe(false)

    it 'Boolean true literal', ->
      expect(Kimbo.isNumeric(true)).toBe(false)

    it 'Boolean false literal', ->
      expect(Kimbo.isNumeric(false)).toBe(false)

    it 'Number with preceding non-numeric characters', ->
      expect(Kimbo.isNumeric('bcfed5.2')).toBe(false)

    it 'Number with trailling non-numeric characters', ->
      expect(Kimbo.isNumeric('7.2acdgs')).toBe(false)

    it 'Undefined value', ->
      expect(Kimbo.isNumeric(undefined)).toBe(false)

    it 'Null value', ->
      expect(Kimbo.isNumeric(null)).toBe(false)

    it 'NaN value', ->
      expect(Kimbo.isNumeric(NaN)).toBe(false)

    it 'Infinity primitive', ->
      expect(Kimbo.isNumeric(Infinity)).toBe(false)

    it 'Positive Infinity', ->
      expect(Kimbo.isNumeric(Number.POSITIVE_INFINITY)).toBe(false)

    it 'Negative Infinity', ->
      expect(Kimbo.isNumeric(Number.NEGATIVE_INFINITY)).toBe(false)

    it 'Empty object', ->
      expect(Kimbo.isNumeric({})).toBe(false)

    it 'Instance of a function', ->
      expect(Kimbo.isNumeric(->)).toBe(false)

    it 'Instance of a Date', ->
      expect(Kimbo.isNumeric(new Date())).toBe(false)

    it 'Instance of a function', ->
      expect(Kimbo.isNumeric(->)).toBe(false)


  describe 'isWindow()', ->

    it 'Kimbo.isWindow on window object should be true', ->
      expect(Kimbo.isWindow(window)).toBe(true)

  describe 'isEmptyObject()', ->

    it 'Kimbo.isEmptyObject on emptyobject literal should be true', ->
      expect(Kimbo.isEmptyObject({})).toBe(true)

    it 'Kimbo.isEmptyObject on non-emptyobject literal should be false', ->
      expect(Kimbo.isEmptyObject({a: 'a'})).toBe(false)

  describe 'isMobile()', ->

    if (Kimbo.isMobile())
      it 'Kimbo.isMobile() should return true in mobile environments', ->
        expect(Kimbo.isMobile()).toBe(true)
    else
      it 'Kimbo.isMobile() should return false in desktop environments', ->
        expect(Kimbo.isMobile()).toBe(false)

  describe 'parseJSON()', ->
    it 'should parse a json string', ->
      expect(Kimbo.parseJSON('{"a": 1}')).toEqual({"a": 1})

  describe 'parseXML()', ->
    it 'should parse a well formed xml string', ->
      xml = Kimbo.parseXML('<p>Test <strong>parse</strong> xml string</p>')

      tmp = xml.getElementsByTagName('p')[0]
      expect(!!tmp, '<p> present in document')

      tmp = tmp.getElementsByTagName('strong')[0]
      expect(!!tmp, '<strong> present in document')

    it 'should fail parsing a not well formed xml string', ->
      try
        xml = Kimbo.parseXML('<p>Test <strong>parse</strong> bad xml string')
      catch e
        expect(e.message, 'Invalid XML: <p>Test <strong>parse</strong> xml string')

    # map
    # makeArray
    # merge
    # camelCase
