$nav = $('#nav')
$iframe = $('#iframe')

firstTest = (if window.location.hash then $(window.location.hash) else $nav.find('a').first()).addClass('current').attr('href')
$iframe.attr('src', firstTest)

$nav.on 'click', 'a', ->
  $(this).addClass('current').parent().siblings().find('a').removeClass('current')
  window.location.hash = '#' + this.id

  $('#iframe').on('load', ->
    console.log 'loaded'
  )

###
window.setTimeout ->
  $('#iframe').contents().find('#bs-chart-frame').contents().find('body').css({
    'background': '#fff',
    'padding': '0px',
    'margin': '0px'
  })
  console.log('done')
, 3000
###
