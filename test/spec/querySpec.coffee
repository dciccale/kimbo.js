describe 'query', ->

  it 'should support ID selector', ->
    el = $('#list')
    expect(el.length).toEqual(1)

  it 'should support class selector', ->
    el = $('.active')
    expect(el.length).toEqual(1)

  it 'should support tag selector', ->
    el = $('section')
    expect(el.length).toEqual(1)

  it 'should support name selector', ->
    el = $('[name="name"]')
    expect(el.length).toEqual(1)

  it 'should support a complex selector', ->
    el = $('#list > li:nth-child(2)')
    expect(el.length).toEqual(1)

  it 'should return multiple results', ->
    el = $('#list li')
    expect(el.length).toEqual(3)

  it 'should return empty set when not match found', ->
    el = $('#noexists')
    expect(el.length).toEqual(0)
