var concat = require('gulp-concat');
var es = require('event-stream');
var gutil = require('gulp-util');
var path = require('path');

var MODULE_TEMPLATES = {
  requirejs: {
    header: 'define([\'angular\'], function(angular) {\n\'use strict\';\nreturn ',
    footer: '});'
  },
  browserify: {
    header: '\'use strict\';\nmodule.exports = '
  },
  es6: {
    header: 'import angular from \'angular\';\nexport default '
  },
  iife: {
    header: '(function(){\n',
    footer: '})();'
  }
};

function cacheTranslations(options) {
  return es.map(function(file, callback) {
    file.contents = new Buffer(gutil.template('$translateProvider.translations("<%= language %>", <%= contents %>);\n', {
      contents: file.contents,
      file: file,
      language: options.language || file.path.split(path.sep).pop().match(/^(?:[\w]{3,}-)?([a-z]{2}[_|-]?(?:[A-Z]{2})?)\.json$/i).pop()
    }));
    callback(null, file);
  });
}

function wrapTranslations(options) {
  var moduleTemplate = MODULE_TEMPLATES[options.moduleSystem] || {};

  return es.map(function(file, callback) {
    file.contents = new Buffer(gutil.template('<%= header %>angular.module("<%= module %>"<%= standalone %>).config(["$translateProvider", function($translateProvider) {\n<%= contents %>}]);\n<%= footer %>', {
      contents: file.contents,
      file: file,
      module: options.module || 'translations',
      standalone: options.standalone === false ? '' : ', []',
      header: moduleTemplate.header || '',
      footer: moduleTemplate.footer || ''
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

  if (options.moduleSystem) {
    options.moduleSystem = options.moduleSystem.toLowerCase();
  }

  return es.pipeline(
    cacheTranslations(options),
    concat(filename),
    wrapTranslations(options)
  );
};

module.exports = gulpAngularTranslate;
