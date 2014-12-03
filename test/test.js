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
      assert.equal(file.contents.toString('utf8'), 'angular.module("translations", []).config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\\"HEADLINE\\":\\"What an awesome module!\\"});\n\n$translateProvider.translations("de", {\\"HEADLINE\\":\\"Was für ein großartiges Modul!\\"});\n}]);\n');
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
      assert.equal(file.contents.toString('utf8'), 'angular.module("test", []).config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\\"HEADLINE\\":\\"What an awesome module!\\"});\n}]);\n');
      cb();
    });

    stream.write(new gutil.File({
      base: __dirname,
      path: __dirname + '/locale-en.json',
      contents: new Buffer('{"HEADLINE":"What an awesome module!"}')
    }));

    stream.end();
  });

  describe('options.standalone', function () {
    it('shouldn\'t create standalone AngularJS module', function(cb) {
      var stream = angularTranslate('translations.js', {
        standalone: false
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/translations.js'));
        assert.equal(file.relative, 'translations.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module("translations").config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\\"HEADLINE\\":\\"What an awesome module!\\"});\n}]);\n');
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
        assert.equal(file.contents.toString('utf8'), 'angular.module("translations", []).config(["$translateProvider", function($translateProvider) {\n$translateProvider.translations("en", {\\"HEADLINE\\":\\"What an awesome module!\\"});\n}]);\n');
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
