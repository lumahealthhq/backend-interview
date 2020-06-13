"use strict";

const { calculateDistance } = require("./distance.js");

const SCORE_COMPOSITION = {
  age: { value: 1, positiveScore: true },
  acceptedOffers: { value: 3, positiveScore: true },
  canceledOffers: { value: 3, positiveScore: false },
  averageReplyTime: { value: 2, positiveScore: false },
  distanceToPractice: { value: 1, positiveScore: false },
};

const PATIENTS_TEST = [
  {
    id: "541d25c9-9500-4265-8967-240f44ecf723",
    name: "Samir Pacocha",
    location: {
      latitude: "46.7110",
      longitude: "-63.1150",
    },
    age: 80,
    acceptedOffers: 40,
    canceledOffers: 0,
    averageReplyTime: 2000,
  },
  {
    id: "41fd45bc-b166-444a-a69e-9d527b4aee48",
    name: "Bernard Mosciski",
    location: {
      latitude: "-81.0341",
      longitude: "144.9963",
    },
    age: 20,
    acceptedOffers: 0,
    canceledOffers: 5,
    averageReplyTime: 10000,
  },
  {
    id: "41fd45bc-b166-444a-a69e-9d527b4aee48",
    name: "Theo Effertz",
    location: {
      latitude: "-25.166111",
      longitude: "-70.744167",
    },
    age: 50,
    acceptedOffers: 20,
    canceledOffers: 2.5,
    averageReplyTime: 6000,
  },
];

exports.generatePatientList = (patients, facilityLocation, listSize = 3) => {
  // compute each patient distance to facility location
  let patientsWithDistance = calculatePatientsDistanceToFacility(
    patients,
    facilityLocation
  );
  console.log(patientsWithDistance);

  // find the ranges of the properties/categories of the data
  const dataRanges = findPatientDataRanges(
    patientsWithDistance,
    SCORE_COMPOSITION
  );
  console.log(dataRanges);

  // given the ranges, calculate the score of each patient
  const patientsWithScore = calculatePatientsScore(
    patientsWithDistance,
    dataRanges,
    SCORE_COMPOSITION
  );

  // sort patients based on their score and include a few patients with little behavioral data in the final list
  return sortPatients(patientsWithScore, listSize);
};

const calculatePatientsDistanceToFacility = (patients, facilityLocation) => {
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

const findPatientDataRanges = (
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

const calculatePatientsScore = (patients, dataRanges, SCORE_COMPOSITION) => {
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

const sortPatients = (
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

const result = this.generatePatientList(PATIENTS_TEST, {
  latitude: "46.7110",
  longitude: "-63.1150",
});

console.log(JSON.stringify(result, null, 2));
