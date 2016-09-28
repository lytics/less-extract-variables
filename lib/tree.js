'use strict';

module.exports = {
  Color: function Color(color) {
    // Convert colors to CSS color notation
    return color.toCSS();
  },

  Dimension: function Dimension(dimension) {
    // Return a tuple with the dimension and unit
    return {
      value: dimension.value,
      unit: (
        dimension.unit.numerator[0] ||
        dimension.unit.denominator[0] ||
        dimension.backupUnit
      )
    };
  },

  Value: function Value(value) {
    // Just unwrap the value
    return require('./convert-value-to-js')(value.value);
  }
};
