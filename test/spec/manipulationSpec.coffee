describe 'manipulation', ->
  $li_first = null
  $li_second = null
  $input = null

  getClass = (el) ->
    el[0].className.trim().split(/\s+/)

  beforeEach ->
    $li_first = $('li.first')
    $li_second = $('li#second')
    $input = $('#name')

  describe 'text()', ->
    it 'should return undefined for a non existing element', ->
      expect($('#noexists').text()).toEqual(undefined)

    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').text()).not.toThrow()

    it 'should return the textContent of an element', ->
      expect($li_first.text()).toEqual('uno')

    it 'should set the textContent of an element', ->
      $li_first.text('one')
      expect($li_first.text()).toEqual('one')

  describe 'html()', ->
    it 'should return undefined for a non existing element', ->
      expect($('#noexists').html()).toEqual(undefined)

    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').html()).not.toThrow()

    it 'should return the innerHTML of an element', ->
      html = document.getElementById('second').innerHTML
      expect($li_second.html()).toEqual(html)

    it 'should set the innerHTML of an element', ->
      content = '<span>dos</span>'
      $li_second.html(content)
      expect($li_second.html()).toEqual(content)

  describe 'val()', ->
    it 'should return undefined for a non existing element', ->
      expect($('#noexists').val()).toEqual(undefined)

    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').val()).not.toThrow()

    it 'should return the value of an element', ->
      value = document.getElementById('name').value
      expect($input.val()).toEqual(value)

    it 'should set the value of an element', ->
      content = 'changed'
      $input.val(content)
      expect($input[0].value).toEqual(content)

  describe 'addClass()', ->
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').addClass('noexists')).not.toThrow()

    it 'should add a class to an element', ->
      $li_first.addClass('uno')
      expect(getClass($li_first)).toEqual(['first', 'active', 'uno'])

    it 'should add multiple classes to an element', ->
      $li_second.addClass('dos two due')
      expect(getClass($li_second)).toEqual(['dos', 'two', 'due'])

    it 'should not fail when calling without arguments', ->
      expect(-> $li_second.addClass()).not.toThrow()

    it 'should not fail when calling empty string', ->
      expect(-> $li_second.addClass('')).not.toThrow()

  describe 'removeClass()', ->
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').removeClass('noexists')).not.toThrow()

    it 'should remove a class from an element', ->
      $li_first.removeClass('uno')
      expect(getClass($li_first)).toEqual(['first', 'active'])

    it 'should remove multiple classes from an element', ->
      $li_second.removeClass('dos due')
      expect(getClass($li_second)).toEqual(['two'])

    it 'should remove all classes from an element if called without arguments', ->
      $li_second.removeClass()
      expect(getClass($li_second)).toEqual([''])

    it 'should remove all classes from an element if called with empty string', ->
      $li_second[0].className = 'test multiple'
      $li_second.removeClass('')
      expect(getClass($li_second)).toEqual([''])
