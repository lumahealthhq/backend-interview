const assert = require('assert');
const { practiceLocation, patientDefaults } = require('./data');
const generateCallList = require('../src/index');

// Arbitrary ids
const ORDERED_IDS = ['a', 'b', 'c'];

const constructPatient = (id, overrides) => Object.assign({ id }, patientDefaults, overrides);

// Scramble intended order and ensure list is unscrambled
const testOrder = (orderedOverrides) => {
  const patientData = [
    constructPatient(ORDERED_IDS[2], orderedOverrides[2]),
    constructPatient(ORDERED_IDS[0], orderedOverrides[0]),
    constructPatient(ORDERED_IDS[1], orderedOverrides[1]),
  ];
  const callList = generateCallList(practiceLocation, patientData);
  const listIds = callList.map(patient => patient.id);
  assert.deepEqual(listIds, ORDERED_IDS);
};

module.exports = { testOrder };
