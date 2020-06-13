"use strict";

const {
  SCORE_COMPOSITION,
  calculatePatientsDistanceToFacility,
  findPatientDataRanges,
  calculatePatientsScore,
  sortPatients,
} = require("./patient-ranking");

const PATIENTS_TEST_DATA = [
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

const FACILITY_LOCATION = {
  latitude: "46.7110",
  longitude: "-63.1150",
};

describe("calculatePatientsDistanceToFacility", () => {
  const patientsWithDistance = calculatePatientsDistanceToFacility(
    PATIENTS_TEST_DATA,
    FACILITY_LOCATION
  );

  it("should campute the distance between a facility location and each patient given a valid list of patients with location", () => {
    patientsWithDistance.forEach((p) => {
      expect(p.distanceToPractice).toBeDefined();
    });
  });

  it("should calculate the distance of 0 (zero) for a patient that has the same exact location as a given facility", () => {
    expect(patientsWithDistance[0].distanceToPractice).toEqual(0);
  });
});

describe("findPatientDataRanges", () => {
  it("should find the ranges of the patients' data given a list of patients and data categories", () => {
    const patientsWithDistance = calculatePatientsDistanceToFacility(
      PATIENTS_TEST_DATA,
      FACILITY_LOCATION
    );

    const dataRanges = findPatientDataRanges(
      patientsWithDistance,
      SCORE_COMPOSITION
    );

    for (let category in SCORE_COMPOSITION) {
      expect(typeof dataRanges[category].min).toEqual("number");
      expect(typeof dataRanges[category].max).toEqual("number");
      expect(typeof dataRanges[category].range).toEqual("number");
      expect(typeof dataRanges[category].bottomThreshold).toEqual("number");
    }
  });

  it("should calculate the correct min, max, range, and bottom threshold given some patient data and its categories", () => {
    const patientsData = [
      {
        age: 5,
        acceptedOffers: 5,
        canceledOffers: 5,
        averageReplyTime: 5,
        distanceToPractice: 5,
      },
      {
        age: 15,
        acceptedOffers: 15,
        canceledOffers: 15,
        averageReplyTime: 15,
        distanceToPractice: 15,
      },
    ];
    const dataRanges = findPatientDataRanges(
      patientsData,
      SCORE_COMPOSITION,
      0.2
    );

    for (let category in SCORE_COMPOSITION) {
      expect(dataRanges[category].min).toEqual(5);
      expect(dataRanges[category].max).toEqual(15);
      expect(dataRanges[category].range).toEqual(10);
      if (SCORE_COMPOSITION[category].positiveScore) {
        expect(dataRanges[category].bottomThreshold).toEqual(7);
      } else {
        expect(dataRanges[category].bottomThreshold).toEqual(13);
      }
    }
  });
});

describe("calculatePatientsScore", () => {
  const patientsWithDistance = calculatePatientsDistanceToFacility(
    PATIENTS_TEST_DATA,
    FACILITY_LOCATION
  );

  const dataRanges = findPatientDataRanges(
    patientsWithDistance,
    SCORE_COMPOSITION
  );

  const patientsWithScore = calculatePatientsScore(
    patientsWithDistance,
    dataRanges,
    SCORE_COMPOSITION
  );

  it("should give each patient a correct score given a certain patient data, the data range, and a score composition object", () => {
    expect(patientsWithScore[0].score).toEqual("10.00");
    expect(patientsWithScore[1].score).toEqual("0.00");
    expect(patientsWithScore[2].score).toEqual("5.00");
  });

  it("should flag a patient with little behaviral data when both acceptedOffers and canceledOffers don't sum up to their bottom thresholds", () => {
    expect(patientsWithScore[0].littleBehaviorData).toEqual(false);
    expect(patientsWithScore[1].littleBehaviorData).toEqual(true);
    expect(patientsWithScore[2].littleBehaviorData).toEqual(false);
  });
});

describe("sortPatients", () => {
  const patientsWithDistance = calculatePatientsDistanceToFacility(
    PATIENTS_TEST_DATA,
    FACILITY_LOCATION
  );

  const dataRanges = findPatientDataRanges(
    patientsWithDistance,
    SCORE_COMPOSITION
  );

  const patientsWithScore = calculatePatientsScore(
    patientsWithDistance,
    dataRanges,
    SCORE_COMPOSITION
  );

  it("should sort patients based ont their score in a descending order if listSize === length of patients", () => {
    const sortedPatients = sortPatients(patientsWithScore, 3);

    expect(sortedPatients).toHaveLength(3);
    expect(sortedPatients[0].name).toEqual("Samir Pacocha");
    expect(sortedPatients[1].name).toEqual("Theo Effertz");
    expect(sortedPatients[2].name).toEqual("Bernard Mosciski");
  });

  it("should sort patients based on their score and include a few patients with little behavioral data (if any) in the final list if listSize < length of patients", () => {
    const sortedPatients = sortPatients(patientsWithScore, 2);
    console.log(sortedPatients);
    expect(sortedPatients).toHaveLength(2);
    expect(sortedPatients[0].name).toEqual("Samir Pacocha");
    expect(sortedPatients[1].name).toEqual("Bernard Mosciski");
  });
});
