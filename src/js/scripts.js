var $nav = $('#nav');
var $iframe = $('#iframe');
var $chartIframe = null;
var tryApplyStyles = null;

var applyStyles = function() {
  if ($chartIframe) {
    $chartIframe.contents().find('body').css({
      backgroundColor: '#fff',
      padding: '0px',
      margin: '0px'
    });
    return window.clearInterval(tryApplyStyles);
  }
};

var firstTest = (window.location.hash ? $(window.location.hash) : $nav.find('a').first()).addClass('current').attr('href');

$iframe.on('load', function() {
  $chartIframe = $iframe.contents().find('#bs-chart-frame');
  return tryApplyStyles = window.setInterval(applyStyles, 10);
});

$iframe.attr('src', firstTest);

$nav.on('click', 'a', function (ev) {
  ev.preventDefault();
  var src = $(this).attr('href');
  $iframe.attr('src', src);
  $(this).addClass('current').parent().siblings().find('a').removeClass('current');
  return window.location.hash = '#' + this.id;
});
