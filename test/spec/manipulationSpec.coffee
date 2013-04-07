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
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').text()).not.toThrow()

    it 'should return undefined for a non existing element', ->
      expect($('#noexists').text()).toEqual(undefined)

    it 'should return the textContent of an element', ->
      expect($li_first.text()).toEqual('uno')

    it 'should set the textContent of an element', ->
      $li_first.text('one')
      expect($li_first.text()).toEqual('one')


  describe 'html()', ->
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').html()).not.toThrow()

    it 'should return undefined for a non existing element', ->
      expect($('#noexists').html()).toEqual(undefined)

    it 'should return the innerHTML of an element', ->
      html = document.getElementById('second').innerHTML
      expect($li_second.html()).toEqual(html)

    it 'should set the innerHTML of an element', ->
      content = '<span>dos</span>'
      $li_second.html(content)
      expect($li_second.html()).toEqual(content)


  describe 'val()', ->
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').val()).not.toThrow()

    it 'should return undefined for a non existing element', ->
      expect($('#noexists').val()).toEqual(undefined)

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

    it 'should only add a class if the nodeType is 1 (ELEMENT_NODE)', ->
      textNode = $($li_first[0].firstChild) # nodeType is 3
      expect(textNode.addClass('text_node')).toEqual(textNode)

    it 'should add multiple classes to an element', ->
      $li_second.addClass('dos two due')
      expect(getClass($li_second)).toEqual(['dos', 'two', 'due'])

    it 'should add multiple classes to multiple elements', ->
      $lis = $('#list2 li').addClass('li mm')
      expect($lis[0].className).toEqual('li mm')
      expect($lis[1].className).toEqual('li mm')
      expect($lis[2].className).toEqual('li mm')

    it 'should not fail when called with wierd or without arguments', ->
      expect(-> $li_second.addClass()).not.toThrow()
      expect(-> $li_second.addClass('')).not.toThrow()
      expect(-> $li_second.addClass(null)).not.toThrow()
      expect(-> $li_second.addClass(true)).not.toThrow()
      expect(-> $li_second.addClass([])).not.toThrow()
      expect(-> $li_second.addClass({})).not.toThrow()

    it 'should do nothing when called with wierd or without arguments', ->
      currentClasses = getClass($li_first)
      $li_first.addClass()
      expect(getClass($li_first)).toEqual(currentClasses)
      $li_first.addClass('')
      expect(getClass($li_first)).toEqual(currentClasses)
      $li_first.addClass(null)
      expect(getClass($li_first)).toEqual(currentClasses)
      $li_first.addClass(true)
      expect(getClass($li_first)).toEqual(currentClasses)
      $li_first.addClass([])
      expect(getClass($li_first)).toEqual(currentClasses)
      $li_first.addClass({})
      expect(getClass($li_first)).toEqual(currentClasses)


  describe 'removeClass()', ->
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').removeClass('noexists')).not.toThrow()

    it 'should remove a class from an element', ->
      $li_first.removeClass('uno')
      expect(getClass($li_first)).toEqual(['first', 'active'])

    it 'should only add a class if the nodeType is 1 (ELEMENT_NODE)', ->
      textNode = $($li_first[0].firstChild) # nodeType is 3
      expect(textNode.removeClass('text_node')).toEqual(textNode)

    it 'should remove multiple classes from an element', ->
      $li_second.removeClass('dos due')
      expect(getClass($li_second)).toEqual(['two'])

    it 'should remove all classes from an element if called without arguments', ->
      $li_second[0].className = 'test multiple'
      $li_second.removeClass()
      expect(getClass($li_second)).toEqual([''])
      $li_second[0].className = 'test multiple'
      $li_second.removeClass('')
      expect(getClass($li_second)).toEqual([''])

    it 'should not fail when called with wierd arguments', ->
      expect(-> $li_second.removeClass(null)).not.toThrow()
      expect(-> $li_second.removeClass(true)).not.toThrow()
      expect(-> $li_second.removeClass([])).not.toThrow()
      expect(-> $li_second.removeClass({})).not.toThrow()

    it 'should do nothing when called with wierd arguments', ->
      currentClasses = getClass($li_first)
      $li_first.removeClass([])
      expect(getClass($li_first)).toEqual(currentClasses)
      $li_first.removeClass({})
      expect(getClass($li_first)).toEqual(currentClasses)

    it 'should remove all clases from an element when falsy values passed', ->
      $li_second[0].className = 'has multiple classes'
      $li_second.removeClass(false)
      expect(getClass($li_second)).toEqual([''])
      $li_second[0].className = 'has multiple classes'
      $li_second.removeClass(null)
      expect(getClass($li_second)).toEqual([''])
      $li_second[0].className = 'has multiple classes'
      $li_second.removeClass(0)
      expect(getClass($li_second)).toEqual([''])


  describe 'hasClass()', ->
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').hasClass()).not.toThrow()

    it 'should return whether an element has the specified class', ->
      expect($li_first.hasClass('first')).toBe(true)
      expect($li_first.hasClass('second')).toBe(false)

    it 'should return whether multiple elements has the specified class', ->
      $lis = $('#list li').addClass('li')
      expect($lis.hasClass('li')).toBe(true)
      expect($lis.hasClass('first')).toBe(false)
      $lis.removeClass('li')

    it 'should return false when weird or no arguments are passed', ->
      expect($li_first.hasClass()).toBe(false)
      expect($li_first.hasClass('')).toBe(false)
      expect($li_first.hasClass(true)).toBe(false)
      expect($li_first.hasClass(false)).toBe(false)
      expect($li_first.hasClass([])).toBe(false)
      expect($li_first.hasClass({})).toBe(false)


  describe 'toggleClass', ->
    it 'should not fail when called on an empty set', ->
      expect(-> $('#noexists').toggleClass()).not.toThrow()

    it 'should add the class if the element has not that class', ->
      $li_second.toggleClass('toggle')
      expect(getClass($li_second)).toEqual(['toggle'])

    it 'should remove the class if the element has that class', ->
      $li_second.toggleClass('toggle')
      expect(getClass($li_second)).toEqual([''])

    it 'should add toggle multiple classes', ->
      $li_second.toggleClass('toggle toggle2 toggle3')
      expect(getClass($li_second)).toEqual(['toggle', 'toggle2', 'toggle3'])

    it 'should remove toggle multiple classes', ->
      $li_second.toggleClass('toggle toggle2 toggle3')
      expect(getClass($li_second)).toEqual([''])

    it 'should accept a bool second parameter indicating wather to add or remove a class', ->
      $li_second.toggleClass('toggle', false)
      expect(getClass($li_second)).toEqual([''])
