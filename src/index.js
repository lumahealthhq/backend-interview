const merge = require('deepmerge');
const {
  calculateDistance,
  updateRange,
  normalize,
  scaleNormalized,
  randomInt,
} = require('./lib');
const optionDefaults = require('./optionDefaults.json');

const NULL_RANGE = {
  min: null,
  max: null,
};

const compileData = (practiceLocation, rawPatientData, maxSampleSize) => {
  // Initialize ranges
  let ranges = {
    age: NULL_RANGE,
    distance: NULL_RANGE,
    acceptedOffers: NULL_RANGE,
    canceledOffers: NULL_RANGE,
    averageReplyTime: NULL_RANGE,
  };

  const patientData = rawPatientData.map((patient) => {
    const {
      id,
      name,
      age,
      location,
      acceptedOffers,
      canceledOffers,
      averageReplyTime,
    } = patient;

    // Calculate distance
    const distance = calculateDistance(practiceLocation, location);

    // Apply random padding to accepted offers
    const totalOffers = acceptedOffers + canceledOffers;
    const missingOffers = maxSampleSize - totalOffers;
    const randomPadding = randomInt(missingOffers);
    const paddedAcceptedOffers = acceptedOffers + randomPadding;

    // Update ranges
    ranges = {
      age: updateRange(ranges.age, age),
      distance: updateRange(ranges.distance, distance),
      acceptedOffers: updateRange(ranges.acceptedOffers, paddedAcceptedOffers),
      canceledOffers: updateRange(ranges.canceledOffers, canceledOffers),
      averageReplyTime: updateRange(ranges.averageReplyTime, averageReplyTime),
    };

    return {
      id,
      name,
      age,
      distance,
      acceptedOffers: paddedAcceptedOffers,
      canceledOffers,
      averageReplyTime,
    };
  });

  return {
    ranges,
    patientData,
  };
};

const scorePatients = (
  ranges,
  patientData,
  factorWeights,
) => patientData.map((patient) => {
  const {
    id,
    name,
    age,
    distance,
    acceptedOffers,
    canceledOffers,
    averageReplyTime,
  } = patient;

  // Normalize individual factor scores
  const factors = {
    age: normalize(age, ranges.age, false),
    distance: normalize(distance, ranges.distance, false),
    acceptedOffers: normalize(acceptedOffers, ranges.acceptedOffers, true),
    canceledOffers: normalize(canceledOffers, ranges.canceledOffers, false),
    averageReplyTime: normalize(averageReplyTime, ranges.averageReplyTime, false),
  };

  // Scale individual factor scores
  const score = factors.age * factorWeights.age
    + factors.distance * factorWeights.distance
    + factors.acceptedOffers * factorWeights.acceptedOffers
    + factors.canceledOffers * factorWeights.canceledOffers
    + factors.averageReplyTime * factorWeights.averageReplyTime;

  return {
    id,
    name,
    score,
  };
});

const generateCallList = (practiceLocation, rawPatientData, options = {}) => {
  // Merge options with defaults
  const {
    scoreMin,
    scoreMax,
    listSize,
    factorWeights,
  } = merge(optionDefaults, options);

  // Determine maximum offer sample size
  const maxSampleSize = rawPatientData.reduce(
    (currentMax, patient) => Math.max(currentMax, patient.acceptedOffers + patient.canceledOffers),
    0,
  );

  // Compile data and score patients
  const { ranges, patientData } = compileData(practiceLocation, rawPatientData, maxSampleSize);
  const scores = scorePatients(ranges, patientData, factorWeights);

  // Sort patient scores from highest to lowest
  const sortedScores = scores.sort((patientA, patientB) => patientB.score - patientA.score);

  // Return top patients with scores scaled as desired
  return sortedScores.slice(0, listSize).map(patient => ({
    id: patient.id,
    name: patient.name,
    score: scaleNormalized(patient.score, { min: scoreMin, max: scoreMax }),
  }));
};

module.exports = generateCallList;
