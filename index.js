var concat = require('gulp-concat');
var es = require('event-stream');
var gutil = require('gulp-util');
var jsStringEscape = require('js-string-escape');

function cacheTranslations(options) {
  return es.map(function(file, callback) {
    file.contents = new Buffer(gutil.template('$translateProvider.translations("<%= language %>", <%= contents %>);\n', {
      contents: jsStringEscape(file.contents),
      file: file,
      language: options.language || file.path.match(/-([a-z]{2})\.json$/)[1]
    }));
    callback(null, file);
  });
}

function wrapTranslations(options) {
  return es.map(function(file, callback) {
    file.contents = new Buffer(gutil.template('angular.module("<%= module %>"<%= standalone %>).config(["$translateProvider", function($translateProvider) {\n<%= contents %>}]);\n', {
      contents: file.contents,
      file: file,
      module: options.module || 'translations',
      standalone: options.standalone === false ? '' : ', []'
    }));
    callback(null, file);
  });
}

function gulpAngularTranslate(filename, options) {
  if (typeof filename === 'string') {
    options = options || {};
  } else {
    options = filename || {};
    filename = options.filename || 'translations.js';
  }
  return es.pipeline(
    cacheTranslations(options),
    concat(filename),
    wrapTranslations(options)
  );
};

module.exports = gulpAngularTranslate;
