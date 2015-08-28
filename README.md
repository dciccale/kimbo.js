<p align="right">
  <a href="https://travis-ci.org/dciccale/kimbo.js">
    <img src="https://img.shields.io/travis/dciccale/kimbo.js.svg?style=flat-square" alt="Build Status" style="max-width:100%;">
  </a>
  <a href="https://coveralls.io/github/dciccale/kimbo.js">
    <img src="https://img.shields.io/coveralls/dciccale/kimbo.js.svg?style=flat-square" alt="Build Status" style="max-width:100%;">
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
In order to run the build task you'll need [NodeJS](http://nodejs.org/) and [Gulp](http://gulpjs.com/).

After installing NodeJS, clone the project by running:

```bash
$ git clone git://github.com/dciccale/kimbo.js.git
```

Install gulp

```bash
$ npm install -g gulp
```

Enter kimbo.js directory and install local dependencies:

```bash
$ cd kimbo.js && npm install
```

Now to run the full build task just run:

```bash
$ gulp
```

A `dist/` folder will be created containing development and production build of kimbo.js including a source map file.

## Running the Unit Tests

### In the Browser

Open `test/spec.html`

### In PhantomJS

Run `gulp test`

## Support

If you're having problems with using the project, use the support forum at CodersClan.

<a href="http://codersclan.net/forum/index.php?repo_id=15"><img src="http://www.codersclan.net/graphics/getSupport_blue_big.png" width="160"></a>

Follow [@kimbojs](http://twitter.com/kimbojs) on twitter to get the latest news.

## Author
Denis Ciccale ([@tdecs](http://twitter.com/tdecs))

*Thanks to [Gonzalo Redondo Portero](http://www.behance.net/?search=gonzalo+redondo) for making the logo*

## License
See [LICENSE.txt](https://raw.github.com/dciccale/kimbo.js/master/LICENSE.txt)
