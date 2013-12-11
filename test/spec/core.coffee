describe 'core', ->

  it 'Kimbo should be defined', ->
    expect(Kimbo).toBeDefined()

  it '$ should be Kimbo', ->
    expect($).toBe(Kimbo)

  it 'can be called without arguments', ->
    expect($() instanceof Kimbo).toBeTruthy()

  it 'can be called with null', ->
    expect($(null) instanceof Kimbo).toBeTruthy()

  it 'can be called with undefined', ->
    expect($(undefined) instanceof Kimbo).toBeTruthy()

  it 'can be called with empty array', ->
    expect($([]) instanceof Kimbo).toBeTruthy()

  it 'can be called with empty object', ->
    expect($({}) instanceof Kimbo).toBeTruthy()

  it 'can be called passing a NodeList', ->
    $obj = $(document.getElementsByTagName('body'))
    expect($obj instanceof Kimbo).toBeTruthy()

  it 'can be called passing a dom element', ->
    $obj = $(document.body)
    expect($obj instanceof Kimbo).toBeTruthy()

  it 'a DOM element in the collection should be an actual DOM node', ->
    $obj = $(document.body)
    expect($obj[0].nodeType).toEqual(1)
