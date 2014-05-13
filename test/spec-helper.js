(function () {
  var fixtureTemplate = document.getElementById('fixture-template').innerHTML;
  var fixtureContainer = document.getElementById('fixture-html');
  var fixtureHtml = document.createElement('div');
  var original;

  fixtureHtml.innerHTML = fixtureTemplate;
  original = fixtureHtml.cloneNode(true);

  beforeEach(function () {
    if (fixtureHtml.parentNode) {
      fixtureHtml.parentNode.removeChild(fixtureHtml);
      fixtureHtml = original.cloneNode(true);
    }
    fixtureContainer.appendChild(fixtureHtml);
  });
}());
