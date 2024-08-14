const { calculatePatientScore } = require("./calculate-patient-score");
const { calculateMinMaxValues } = require("./calculate-min-max-values");
const { distanceBetweenCoords } = require("./distance-between-coordinates");

require("../_types");

/**
 * @param {Patient[]} patients
 * @param {{ latitude: string, longitude: number }} facilityCoords
 */
module.exports.getPatientsWithScores = (patients, facilityCoords) => {
  const minMaxValues = calculateMinMaxValues(patients);

  return patients.map((patient) => {
    const distance = distanceBetweenCoords(
      parseFloat(facilityCoords.latitude, 10),
      parseFloat(facilityCoords.longitude, 10),
      parseFloat(patient.location.latitude, 10),
      parseFloat(patient.location.longitude, 10)
    );

    const { littleBehaviorScore, score } = calculatePatientScore(
      { ...patient, distance },
      minMaxValues
    );

    return {
      ...patient,
      score,
      distance,
      littleBehaviorScore,
    };
  });
};
