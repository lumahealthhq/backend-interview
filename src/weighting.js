const mathUtils = require('./utils/math.utils');
const commonUtils = require('./utils/common.utils');

const { roundUp } = mathUtils;
const { isNullOrUndefined } = commonUtils;

/**
 * Creates a weighing interval list to classify a patient into a given category.
 *
 * @param {Array} values A list of numbers representing the base data for weighing interval creation.
 *
 * @returns {Array} A list of objects with a range and the weighting percent. Each element
 * has the following props: from, to, percent.
 * E.g.: [{ from: 0, to: 50, percent: 100 }, { from: 51, to: 100, percent: 50 }]
 */
const generateWeighingRange = (values) => {
  const percentageRange = 100 / (values.length - 1);
  const rangeList = [];

  for (let i = 0; i < values.length - 1; i += 1) {
    const percent = 100 - percentageRange * i;
    // From lowest to highest values.
    const fromLowestToHighest = values[i] <= values[i + 1];
    let adjust = 1;
    if ((fromLowestToHighest && i === 0) || (!fromLowestToHighest && i === values.length - 2)) {
      adjust = 0;
    }

    if (fromLowestToHighest) {
      rangeList.push({ from: values[i] + adjust, to: values[i + 1], percent });
    } else {
      rangeList.push({ from: values[i + 1] + adjust, to: values[i], percent });
    }

    if (percent <= 0) {
      return rangeList;
    }
  }

  return rangeList;
};

/**
 * Extract all the acceptedOffers and canceledOffers values from the dataset and create
 * and object with a weighing interval list to classify a patient into those categories.
 *
 * @param {Array} dataset List of patient demographics and behavioral data.
 *
 * @returns {Object} An object with two lists: acceptedOffersRange and canceledOffersRange.
 */
exports.extractDemographicsAndBehavioralData = (dataset) => {
  const acceptedOffersSet = new Set();
  const canceledOffersSet = new Set();

  dataset.forEach((item) => {
    acceptedOffersSet.add(roundUp(item.acceptedOffers));
    canceledOffersSet.add(roundUp(item.canceledOffers));
  });

  const acceptedOffersRange = generateWeighingRange(
    Array.from(acceptedOffersSet).sort((a, b) => b - a)
  );
  const canceledOffersRange = generateWeighingRange(
    Array.from(canceledOffersSet).sort((a, b) => a - b)
  );

  return {
    acceptedOffersRange,
    canceledOffersRange
  };
};

exports.configureWeightingData = (dataset, weightingCategories) => {
  // The First step is to extract the number of accepted and canceled offers to generate
  // a Weighting range through it.
  const weighting = { ...weightingCategories };
  const {
    acceptedOffersRange,
    canceledOffersRange
  } = this.extractDemographicsAndBehavioralData(dataset);

  const hasWeightingOfAcceptedOffers = !isNullOrUndefined(weighting.acceptedOffers)
    && !Array.isArray(weighting.acceptedOffers.weighingList);

  // Checks if weightingCategories has the criteria to calculate the score based on accepted offers.
  // If Not, apply it from the extraction done above, from the dataset.
  if (hasWeightingOfAcceptedOffers) {
    const { maxPoints } = weighting.acceptedOffers || 0;
    weighting.acceptedOffers = {
      maxPoints,
      weighingList: acceptedOffersRange
    };
  }

  const hasWeightingOfCanceledOffers = !isNullOrUndefined(weighting.canceledOffers)
    && !Array.isArray(weighting.canceledOffers.weighingList);

  // Checks if weightingCategories has the criteria to calculate the score based on accepted offers.
  // If Not, apply it from the extraction done above, from the dataset.
  if (hasWeightingOfCanceledOffers) {
    const { maxPoints } = weighting.canceledOffers || 0;
    weighting.canceledOffers = {
      maxPoints,
      weighingList: canceledOffersRange
    };
  }

  return weighting;
};
