$nav = $('#nav')
firstTest = (if window.location.hash then $(window.location.hash) else $nav.find('a').first()).addClass('current').attr('href')
$('#iframe').attr('src', firstTest)
$nav.on 'click', 'a', ->
  $(this).addClass('current').parent().siblings().find('a').removeClass('current')
  window.location.hash = '#' + this.id
