(function () {
  var fixtureTemplate = document.getElementById('fixture-template').innerHTML;
  var fixtureContainer = document.getElementById('fixture-html');
  var fixtureHtml = document.createElement('div');
  fixtureHtml.innerHTML = fixtureTemplate;
  var original = fixtureHtml.cloneNode();

  beforeEach(function () {
    if (fixtureHtml.parentNode) {
      fixtureHtml.parentNode.removeChild(fixtureHtml);
      fixtureHtml = original.cloneNode();
    }
    fixtureContainer.appendChild(fixtureHtml);
  });
}());
