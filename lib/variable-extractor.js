/* global Promise */
'use strict';

var convertValueToJs = require('./convert-value-to-js');
var makeFakeContext = require('./make-fake-context');
var PromiseConstructor = 'undefined' === typeof Promise ? require('promise') : Promise;

module.exports = VariableExtractor;

function VariableExtractor() {}

VariableExtractor.prototype = {
  run: function run(root) {
    var variableTable = root.variables();
    var fakeContext = makeFakeContext(root);

    this._variables = Object.keys(variableTable)
      .map(function(variable) {
        return variableTable[variable].eval(fakeContext);
      })
      .reduce(function(memo, item) {
        memo[item.name] = convertValueToJs(item);
        return memo;
      }, {});

    if (this._resolve != null) {
      this._resolve(this._variables);
    }
  },

  getVariables: function getVariables() {
    if (this._promise == null) {
      this._promise = new PromiseConstructor(function(resolve) {
        this._resolve = resolve;
      }.bind(this));
    }
    if (this._variables) {
      this._resolve(this._variables);
    }
    return this._promise;
  },
};
