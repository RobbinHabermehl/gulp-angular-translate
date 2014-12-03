# gulp-angular-translate

> Concatenates and registers translations for angular-translate in an AngularJS module.

<a href="#install">Install</a> |
<a href="#example">Example</a> |
<a href="#api">API</a> |
[Releases](https://github.com/RobbinHabermehl/gulp-angular-translate/releases) |
<a href="#license">License</a>

----

## Install

Install with [npm](https://npmjs.org/package/gulp-angular-translate)

```
npm install gulp-angular-translate --save-dev
```

## Example

**gulpfile.js**

> Concatinate the contents of all `.json` files in the `src` directory and save to `app/js/translations.js` (default filename).

```js
var angularTranslate = require('gulp-angular-translate');

gulp.task('default', function () {
	gulp.src('src/**/locale-*.json')
		.pipe(angularTranslate())
		.pipe(gulp.dest('app/js'));
});
```

**Result (`app/js/translations.js`)**

> Sample output (prettified).

```js
angular.module("translations", []).config(["$translateProvider", function($translateProvider) {
	$translateProvider.translations("en", { ... });
}]);
```

## API

gulp-angular-translate([filename](https://github.com/RobbinHabermehl/gulp-angular-translate#filename---string-filenametemplatesjs), [options](https://github.com/RobbinHabermehl/gulp-angular-translate#options))

---- 

### filename - {string} [filename='translations.js']

> Name to use when concatinating.

### options

#### module - {string} [module='translations']

> Name of AngularJS module.

#### standalone - {boolean} [standalone=true]

> Create a new AngularJS module, instead of using an existing.

## License

The MIT License (MIT)

Copyright (c) 2014 [Robbin Habermehl](http://www.linkedin.com/in/robbinhabermehl)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
