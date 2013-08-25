$nav = $('#nav')
$iframe = $('#iframe')
$chartIframe = null
tryApplyStyles = null
applyStyles = ->
  if ($chartIframe)
    $chartIframe.contents().find('body').css({
      backgroundColor: '#fff',
      padding: '0px',
      margin: '0px'
    })
    window.clearInterval tryApplyStyles

firstTest = (if window.location.hash then $(window.location.hash) else $nav.find('a').first()).addClass('current').attr('href')
$iframe.on('load', ->
  $chartIframe = $iframe.contents().find('#bs-chart-frame')
  tryApplyStyles = window.setInterval applyStyles, 10
)

$iframe.attr('src', firstTest)

$nav.on 'click', 'a', ->
  $(this).addClass('current').parent().siblings().find('a').removeClass('current')
  window.location.hash = '#' + this.id
