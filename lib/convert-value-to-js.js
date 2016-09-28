'use strict';

var tree = require('./tree');

module.exports = convertValueToJs;

function convertValueToJs(value) {
  if (Array.isArray(value)) {
    if (value.length > 1) {
      return value.map(convertValueToJs);
    }
    // unwrap the singleton
    value = value[0];
  }
  var convert = tree[value.value.type];

  if (convert) {
    return convert(value.value);
  }
  return value.value;
}
