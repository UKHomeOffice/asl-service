const { suitabilityCodes, holdingCodes } = require('../../../constants');
const { castArray } = require('lodash');

const toArray = val => {
  if (!val) {
    return [];
  }
  return castArray(val);
};

module.exports = {
  site: {
    inputType: 'inputText',
    validate: [
      'required'
    ]
  },
  area: {
    inputType: 'inputText'
  },
  name: {
    inputType: 'inputText',
    validate: [
      'required'
    ]
  },
  suitability: {
    inputType: 'checkboxGroup',
    options: suitabilityCodes,
    format: toArray,
    validate: [
      'required',
      {
        definedValues: suitabilityCodes
      }
    ]
  },
  holding: {
    inputType: 'checkboxGroup',
    options: holdingCodes,
    format: toArray,
    validate: [
      'required',
      {
        definedValues: holdingCodes
      }
    ]
  },
  nacwo: {
    inputType: 'select',
    accessor: 'id',
    validate: ['required']
  }
};
