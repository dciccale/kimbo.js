// expose Kimbo to global object
window.Kimbo = window.$ = Kimbo;

// expose Kimbo as an AMD module
if (typeof window.define === 'function' && window.define.amd) {
  window.define('kimbo', [], function () {
    return window.Kimbo;
  });
}