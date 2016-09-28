/* global Promise */
'use strict';

var PromiseConstructor = 'undefined' === typeof Promise ? require('promise') : Promise;
var merge = require('lodash.merge');

module.exports = VariableExtractor;

VariableExtractor.converters = {
  Color: function Color(color) {
    // Convert colors to CSS color notation
    return color.toCSS();
  },

  Dimension: function Dimension(dimension) {
    // Return a tuple with the dimension value and unit
    return {
      value: dimension.value,
      unit: (
        // This may be overly simplistic/naive
        dimension.unit.numerator[0] ||
        dimension.unit.denominator[0] ||
        dimension.backupUnit
      ),
    };
  },

  Value: function Value(value, converters) {
    // Just unwrap the value
    return convertValueToJs(value.value, converters);
  },
};

function VariableExtractor(options) {
  var userConverters = options && options.converters;

  this.converters = merge({}, VariableExtractor.converters, userConverters);
}

VariableExtractor.prototype = {
  run: function run(root) {
    var globalContext = createGlobalContext(root);
    var converters = this.converters;
    var variables = root.variables();

    // Extract the variables from the Less AST
    this.variables = Object.keys(variables)
      .map(function(variableName) {
        return variables[variableName].eval(globalContext);
      })
      .reduce(function(memo, value) {
        memo[value.name] = convertValueToJs(value, converters);
        return memo;
      }, {});

    this.resolve(this.variables);
  },

  promise: function promise() {
    if (this._promise == null) {
      this._promise = new PromiseConstructor(function(resolve) {
        this._resolve = resolve;
      }.bind(this));
    }
    return this._promise;
  },

  resolve: function resolve(value) {
    // Might need to resolve the promise (if it hasn't been resolved already)
    if (this._resolve != null) {
      // Resolve it and null out the capability
      this._resolve(value);
      this._resolve = null;
    }
  },
};

function convertValueToJs(value, converters) {
  if (Array.isArray(value)) {
    // Handle the ever-important case of an array of values
    if (value.length > 1) {
      return value.map(function(item) {
        return convertValueToJs(item, converters);
      });
    }
    // Unwrap the singleton. Seems redundant.
    value = value[0];
  }

  // There could be a special transform for this case
  var convert = converters[value.value.type];

  if (convert) {
    return convert(value.value, converters);
  }

  // Otherwise, just propogate the thing
  return value.value;
}

function createGlobalContext(tree) {
  return {
    frames: [ tree ],
    importantScope: [],
    isMathOn: function isMathOn() {
      return true;
    },
    inParenthesis: function inParenthesis() {
      return false;
    },
    outOfParenthesis: function outOfParenthesis() {
      return true;
    },
  };
}

