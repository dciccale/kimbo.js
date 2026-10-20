<p align="right">
  <a href="https://travis-ci.org/dciccale/kimbo.js">
    <img src="https://img.shields.io/travis/dciccale/kimbo.js.svg?style=flat-square" alt="Build Status" style="max-width:100%;">
  </a>
</p>

<p align="center"><a href="http://kimbojs.com"><img src="http://kimbojs.com/img/logo.png" width="409" height="120" alt="kimbo.js logo"></a></p>

<h3 align="center">An ECMAScript 5 only-compatible JavaScript library</h3>

The goal of this light-weight JavaScript library is to provide a nice, shorter and extended API using latest native compliant JavaScript and DOM APIs.
Taking advantage of amazing native speed, of course only in modern browsers, and no more adding extra bytes for older ones.

Give it a try and start using a robust, light-weight and modern library today.

## API Documentation
Please [visit the documentation](http://kimbojs.com/api) to see how easy is to use with its jQuery-like API.

## Build

Use Node.js 22 or later and npm 10 or later.

```sh
npm ci
npx gulp build
```

The `dist/` directory contains the development build, the minified build, and its source map.

## Test

Install Google Chrome or Chromium, then run:

```sh
npm test
```

Karma runs the browser tests in headless Chrome. Set `CHROME_BIN` if Karma cannot find the browser.
To run tests in a visible browser, open `test/spec.html`.
Run `npx gulp coverage-report` to copy the coverage report to `www/coverage/`.

The old Coveralls uploader, Plato report, and contributor-list task have been removed.
Their dependencies are unmaintained and include vulnerable packages.

### Remaining development dependency alert

`npm audit` still reports [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
for `braces@3.0.3`. Gulp and Karma depend on this package, and no patched version is published.
This alert also affects packages that depend on `braces`.
Do not pass untrusted glob patterns to the development tools.
The browser library has no runtime npm dependencies.

## Support

If you're having problems with using the project, use the support forum at CodersClan.

<a href="http://codersclan.net/forum/index.php?repo_id=15"><img src="http://www.codersclan.net/graphics/getSupport_blue_big.png" width="160"></a>

Follow [@kimbojs](http://twitter.com/kimbojs) on twitter to get the latest news.

*Thanks to [Gonzalo Redondo Portero](http://www.behance.net/?search=gonzalo+redondo) for making the logo*

## License
See [LICENSE.txt](https://raw.github.com/dciccale/kimbo.js/master/LICENSE.txt)
