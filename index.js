'use strict';

var VariableExtractor = require('./lib/variable-extractor');

module.exports = VariableExtractorPlugin;

function VariableExtractorPlugin() {
  this.visitor = new VariableExtractor();
}

VariableExtractorPlugin.prototype = {
  install: function install(less, pluginManager) {
    pluginManager.addVisitor(this.visitor);
  },

  getVariables: function getVariables() {
    return this.visitor.promise();
  },
};
