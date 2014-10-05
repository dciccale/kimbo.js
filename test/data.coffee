describe 'data', ->

  it 'should store data in elements', ->
    $el = $(document.createElement('div'))

    expect($el.data('key')).toEqual(undefined)
    $el.data('key', 'value')
    expect($el.data('key')).toEqual('value')
