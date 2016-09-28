'use strict';

var VariableExtractor = require('./lib/variable-extractor');

module.exports = {
  _visitor: this._visitor = new VariableExtractor(),

  install: function install(less, pluginManager) {
    pluginManager.addVisitor(this._visitor);
  },

  getVariables: function getVariables() {
    return this._visitor.getVariables();
  }
};
