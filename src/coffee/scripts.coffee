$nav = $('#nav')
firstTest = $nav.find('a').first().addClass('current')
$('#iframe').attr('src', firstTest.attr('href'))
$nav.on 'click', 'a', ->
  $(this).addClass('current').parent().siblings().find('a').removeClass('current')
