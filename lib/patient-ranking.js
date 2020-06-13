"use strict";

const { calculateDistance } = require("./distance.js");

exports.SCORE_COMPOSITION = {
  age: { value: 1, positiveScore: true },
  acceptedOffers: { value: 3, positiveScore: true },
  canceledOffers: { value: 3, positiveScore: false },
  averageReplyTime: { value: 2, positiveScore: false },
  distanceToPractice: { value: 1, positiveScore: false },
};

exports.generatePatientList = (patients, facilityLocation, listSize = 3) => {
  // compute each patient distance to facility location
  let patientsWithDistance = this.calculatePatientsDistanceToFacility(
    patients,
    facilityLocation
  );

  // find the ranges of the properties/categories of the data
  const dataRanges = this.findPatientDataRanges(
    patientsWithDistance,
    this.SCORE_COMPOSITION
  );

  // given the ranges, calculate the score of each patient and flag if a patient has little behavioral data
  const patientsWithScore = this.calculatePatientsScore(
    patientsWithDistance,
    dataRanges,
    this.SCORE_COMPOSITION
  );

  // sort patients based on their score and include a few patients with little behavioral data in the final list
  return this.sortPatients(patientsWithScore, listSize);
};

exports.calculatePatientsDistanceToFacility = (patients, facilityLocation) => {
  return patients.map((patient) => {
    const distanceToPractice = calculateDistance(
      Number(patient.location.latitude),
      Number(patient.location.longitude),
      Number(facilityLocation.latitude),
      Number(facilityLocation.longitude)
    );

    return {
      ...patient,
      distanceToPractice,
    };
  });
};

exports.findPatientDataRanges = (
  patients,
  SCORE_COMPOSITION,
  bottomThreshold = 0.3
) => {
  let dataRanges = {
    age: {},
    acceptedOffers: {},
    canceledOffers: {},
    averageReplyTime: {},
    distanceToPractice: {},
  };

  patients.forEach((patient) => {
    for (let category in SCORE_COMPOSITION) {
      if (
        patient[category] < dataRanges[category].min ||
        dataRanges[category].min === undefined
      ) {
        dataRanges[category].min = patient[category];
      }

      if (
        patient[category] > dataRanges[category].max ||
        dataRanges[category].max === undefined
      ) {
        dataRanges[category].max = patient[category];
      }

      // calulating category range
      dataRanges[category].range =
        dataRanges[category].max - dataRanges[category].min;

      // calculating category bottom threshold, which defaults to the bottom thirty percent
      if (SCORE_COMPOSITION[category].positiveScore) {
        dataRanges[category].bottomThreshold =
          dataRanges[category].min +
          dataRanges[category].range * bottomThreshold;
      } else {
        dataRanges[category].bottomThreshold =
          dataRanges[category].max -
          dataRanges[category].range * bottomThreshold;
      }
    }
  });

  return dataRanges;
};

exports.calculatePatientsScore = (patients, dataRanges, SCORE_COMPOSITION) => {
  return patients.map((patient) => {
    let score = 0;
    let littleBehaviorData = false;

    for (let category in SCORE_COMPOSITION) {
      // calculating patient score
      let categoryPercentage;

      if (SCORE_COMPOSITION[category].positiveScore) {
        categoryPercentage =
          (patient[category] - dataRanges[category].min) /
          dataRanges[category].range;
      } else {
        categoryPercentage =
          (dataRanges[category].max - patient[category]) /
          dataRanges[category].range;
      }

      score += categoryPercentage * SCORE_COMPOSITION[category].value;
    }

    // checking if patient has little behavioral data
    // leaving averageReplyTime out of this since "average" doesn't tell us the # of data points available - it could be one or one million ..
    const patientTotalBehaviorData =
      patient.acceptedOffers + patient.canceledOffers;

    const behaviorDataThreeshold =
      dataRanges.acceptedOffers.bottomThreshold +
      dataRanges.canceledOffers.bottomThreshold;

    if (patientTotalBehaviorData < behaviorDataThreeshold) {
      littleBehaviorData = true;
    }

    return {
      ...patient,
      score: score.toFixed(2),
      littleBehaviorData,
    };
  });
};

exports.sortPatients = (
  patients,
  finalListLength,
  littleBehaviorDataPercentage = 0.3
) => {
  const sortedPatients = patients.sort((a, b) => b.score - a.score);

  let numberOfTopScorePatients = Math.round(
    finalListLength * (1 - littleBehaviorDataPercentage)
  );

  const littleBehaviorDataPatients = sortedPatients.filter(
    (patient) => patient.littleBehaviorData
  );

  // checking if we can fill the 30% of the list with littleBehaviorDataPatients
  if (
    numberOfTopScorePatients + littleBehaviorDataPatients.length <
    finalListLength
  ) {
    numberOfTopScorePatients =
      finalListLength - littleBehaviorDataPatients.length;
  }

  let finalListOfPatients = sortedPatients.slice(0, numberOfTopScorePatients);

  while (finalListOfPatients.length < finalListLength) {
    const randomIndex = Math.floor(
      Math.random() * littleBehaviorDataPatients.length
    );
    finalListOfPatients.push(littleBehaviorDataPatients[randomIndex]);
  }

  return finalListOfPatients;
};
