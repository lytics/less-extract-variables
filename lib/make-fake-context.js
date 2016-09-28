'use strict';

module.exports = makeFakeContext;

function makeFakeContext(tree) {
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
    }
  };
}
