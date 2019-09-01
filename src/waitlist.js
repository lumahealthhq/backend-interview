const score = require('./score');
const weighting = require('./weighting');
const commonUtils = require('./utils/common.utils');

const { calculatePatientScore } = score;
const { configureWeightingData } = weighting;
const { isNullOrUndefined } = commonUtils;

// TODO: load this information from a DB or some configuration source.
const BEHAVIOR_MINIMUN_VALUE = 15;
const WEIGHING_CATEGORIES = {
  age: {
    maxPoints: 1,
    weighingList: [
      { from: 0, to: 15, percent: 20 },
      { from: 16, to: 20, percent: 50 },
      { from: 21, to: 50, percent: 80 },
      { from: 51, to: 70, percent: 100 },
      { from: 71, to: 80, percent: 50 },
      { from: 81, to: 999, percent: 20 }
    ]
  },
  distance: {
    maxPoints: 1,
    weighingList: [
      { from: 0, to: 5.99, percent: 100 },
      { from: 6, to: 10.99, percent: 90 },
      { from: 11, to: 15.99, percent: 70 },
      { from: 16, to: 30.99, percent: 50 },
      { from: 31, to: 40.99, percent: 20 },
      { from: 41, to: 55.99, percent: 5 }
    ]
  },
  replyTime: {
    maxPoints: 2,
    weighingList: [
      { from: 0, to: 120, percent: 100 },
      { from: 121, to: 240, percent: 95 },
      { from: 241, to: 420, percent: 90 },
      { from: 421, to: 840, percent: 80 },
      { from: 841, to: 1800, percent: 40 },
      { from: 1801, to: 2400, percent: 20 },
      { from: 2401, to: 3000, percent: 5 },
      { from: 3001, to: 3600, percent: 1 }
    ]
  },
  acceptedOffers: {
    maxPoints: 3
  },
  canceledOffers: {
    maxPoints: 3
  }
};

/**
 * Taking a patients list and the facility's location, it process this list and generates
 * an ordered list of N patients who will most likely accept the appointment offer.
 *
 * @param {Array} dataset               Current waitlist with patient demographics & behavioral data.
 * @param {number} facilityLat          The facility's latitude location.
 * @param {number} facilityLng          The facility's longitude location.
 * @param {number} listSize             The size of the list to be returned. Default value is 10.
 * @param {Object} weightingSpecs       The weighting specification to calculate the score using
 *                                      Demographic and Behavior data. Note: It will use the default
 *                                      specs to calculate if doesn't receive a object for that.
 *
 * @returns {Promise} A Promise with an ordered Array of N [listSize] patients who will
 * most likely accept the appointment offer.
 */
exports.generateImprovedWaitlist = async (
  dataset,
  facilityLat,
  facilityLng,
  listSize = 10,
  weightingSpecs = WEIGHING_CATEGORIES
) => {
  if (!Array.isArray(dataset) || isNullOrUndefined(facilityLat) || isNullOrUndefined(facilityLng)) {
    throw new Error('Some parameter is missing.');
  }

  // The First step is to extract the number of accepted and canceled offers to generate
  // a Weighting range through it. In case of the weightingCategories doesn't have this range yet.
  const weightingDataSpecs = configureWeightingData(dataset, weightingSpecs);

  // The next step is to calculate the score for each patient in the dataset.
  const waitlist = dataset.map((item) => calculatePatientScore(
    item,
    facilityLat,
    facilityLng,
    weightingDataSpecs,
    BEHAVIOR_MINIMUN_VALUE
  ));
  const sortedWaitlist = waitlist.sort((a, b) => b.score - a.score);

  // Take in consideration that patients who have little behavior data should be randomly added
  // to the top list as to give them a chance to be selected.
  const patientWithLittleBehavioralData = waitlist.find((item) => !item.hasEnoughBehaviorData);

  // Return the current list if it doesn't contain a patient with little behavioral data.
  if (isNullOrUndefined(patientWithLittleBehavioralData)) {
    return sortedWaitlist.slice(0, listSize);
  }

  const patientIndex = sortedWaitlist.indexOf(patientWithLittleBehavioralData);
  if (patientIndex < listSize || sortedWaitlist < listSize) {
    sortedWaitlist.splice(patientIndex, 1);
  }

  // Add a patient with not enough behavior data to the top of the list and remove the last one.
  sortedWaitlist.splice(0, 0, patientWithLittleBehavioralData);

  return sortedWaitlist.slice(0, listSize);
};
