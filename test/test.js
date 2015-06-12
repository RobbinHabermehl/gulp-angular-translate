var path = require('path');
var assert = require('assert');
var gutil = require('gulp-util');
var angularTranslate = require('../index');

describe('gulp-angular-translate', function () {
  it('should build valid $translateProvider.translations from multiple source-files', function(cb) {
    var stream = angularTranslate('translations.js');

    stream.on('data', function(file) {
      assert.equal(path.normalize(file.path), path.normalize(__dirname + '/translations.js'));
      assert.equal(file.relative, 'translations.js');
      assert.equal(file.contents.toString('utf8'), 'angular.module("translations", []).config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\"HEADLINE\":\"What an awesome module!\"});\n\n$translateProvider.translations("de", {\"HEADLINE\":\"Was für ein großartiges Modul!\"});\n}]);\n');
      cb();
    });

    stream.write(new gutil.File({
      base: __dirname,
      path: __dirname + '/locale-en.json',
      contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
    }));

    stream.write(new gutil.File({
      base: __dirname,
      path: __dirname + '/locale-de.json',
      contents: new Buffer('{"HEADLINE":"Was für ein großartiges Modul!"}')
    }));

    stream.end();
  });

  it('should allow options as first parameter if no filename is specified', function(cb) {
    var stream = angularTranslate({
      module: 'test'
    });

    stream.on('data', function(file) {
      assert.equal(path.normalize(file.path), path.normalize(__dirname + '/translations.js'));
      assert.equal(file.relative, 'translations.js');
      assert.equal(file.contents.toString('utf8'), 'angular.module("test", []).config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\"HEADLINE\":\"What an awesome module!\"});\n}]);\n');
      cb();
    });

    stream.write(new gutil.File({
      base: __dirname,
      path: __dirname + '/locale-en.json',
      contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
    }));

    stream.end();
  });

  it('should derive the language from various naming conventions', function(cb) {
    var filenames = {
      'locale-en.json': 'en',
      'locale-en-us.json': 'en-us',
      'locale-en_us.json': 'en_us',
      'locale-en-US.json': 'en-US',
      'locale-en_US.json': 'en_US',
      'i18n-en.json': 'en',
      'i18n-en-us.json': 'en-us',
      'i18n-en_us.json': 'en_us',
      'i18n-en-US.json': 'en-US',
      'i18n-en_US.json': 'en_US',
      'en.json': 'en',
      'en-us.json': 'en-us',
      'en_us.json': 'en_us',
      'en-US.json': 'en-US',
      'en_US.json': 'en_US'
    };

    for (var filename in filenames) {
      var stream = angularTranslate('translations.js');

      stream.on('data', function (file) {
        assert.equal(new RegExp('\\$translateProvider\\.translations\\("' + filenames[filename] + '"').test(file.contents.toString('utf8')), true);
      });

      stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/' + filename,
        contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
      }));

      stream.end();      
    }
    
    cb();
  });

  it('should derive the language from locale-folders', function(cb) {
    var filenames = {
      'path/en/locale.json': 'en',
      'path/en-us/locale.json': 'en-us',
      'path/en_us/locale.json': 'en_us',
      'path/en-US/locale.json': 'en-US',
      'path/en_US/locale.json': 'en_US'
    };

    for (var filename in filenames) {
      var stream = angularTranslate('translations.js', {
        useFolders: true
      });

      stream.on('data', function (file) {
        assert.equal(new RegExp('\\$translateProvider\\.translations\\("' + filenames[filename] + '"').test(file.contents.toString('utf8')), true);
      });

      stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/' + filename,
        contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
      }));

      stream.end();      
    }
    
    cb();
  });

  describe('options.standalone', function () {
    it('shouldn\'t create standalone AngularJS module', function(cb) {
      var stream = angularTranslate('translations.js', {
        standalone: false
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/translations.js'));
        assert.equal(file.relative, 'translations.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module("translations").config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\"HEADLINE\":\"What an awesome module!\"});\n}]);\n');
        cb();
      });

      stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/locale-en.json',
        contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
      }));

      stream.end();
    });
  });

  describe('options.filename', function () {
    it('should default to translations.js if not specified', function(cb) {
      var stream = angularTranslate();

      stream.on('data', function(file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/translations.js'));
        assert.equal(file.relative, 'translations.js');
        cb();
      });

      stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/locale-en.json',
        contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
      }));

      stream.end();
    });

    it('should set filename', function(cb) {
      var stream = angularTranslate({
        standalone: true,
        filename: 'foobar.js'
      });

      stream.on('data', function(file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/foobar.js'));
        assert.equal(file.relative, 'foobar.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module("translations", []).config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\"HEADLINE\":\"What an awesome module!\"});\n}]);\n');
        cb();
      });

      stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/locale-en.json',
        contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
      }));

      stream.end();
    });
  });
});
