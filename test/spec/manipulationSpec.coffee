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
    it 'should return the textContent of an element', ->
      expect($li_first.text()).toEqual('uno')

    it 'should set the textContent of an element', ->
      $li_first.text('one')
      expect($li_first.text()).toEqual('one')

  describe 'html()', ->
    it 'should return the innerHTML of an element', ->
      html = document.getElementById('second').innerHTML
      expect($li_second.html()).toEqual(html)

    it 'should set the innerHTML of an element', ->
      content = '<span>dos</span>'
      $li_second.html(content)
      expect($li_second.html()).toEqual(content)

  describe 'val()', ->
    it 'should return the value of an element', ->
      value = document.getElementById('name').value
      expect($input.val()).toEqual(value)

    it 'should set the value of an element', ->
      content = 'changed'
      document.getElementById('name').value = content
      expect($input.val()).toEqual(content)

  describe 'addClass()', ->
    it 'should add a class to an element', ->
      $li_first.addClass('uno')
      expect(getClass($li_first)).toEqual(['first', 'active', 'uno'])

    it 'should add multiple classes to an element', ->
      $li_second.addClass('dos two due')
      expect(getClass($li_second)).toEqual(['dos', 'two', 'due'])

  describe 'removeClass()', ->
    it 'should remove a class from an element', ->
      $li_first.removeClass('uno')
      expect(getClass($li_first)).toEqual(['first', 'active'])

    it 'should remove multiple classes from an element', ->
      $li_second.removeClass('dos due')
      expect(getClass($li_second)).toEqual(['two'])

    it 'should remove all classes from an element', ->
      $li_second.removeClass()
      expect(getClass($li_second)).toEqual([''])
