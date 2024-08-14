import { calculateMinMaxValues } from "./calculate-min-max-values";
import { calculatePatientScore } from "./calculate-patient-score";
import { distanceBetweenCoords } from "./distance-between-coordinates";

export const getPatientsWithScores = (
  patients: Patient[],
  facilityCoords: FacilityLocation
) => {
  const minMaxValues = calculateMinMaxValues(patients);

  return patients.map((patient) => {
    const distance = distanceBetweenCoords(
      parseFloat(facilityCoords.latitude),
      parseFloat(facilityCoords.longitude),
      parseFloat(patient.location.latitude),
      parseFloat(patient.location.longitude)
    );

    const { littleBehaviorScore, score } = calculatePatientScore(
      { ...patient, distance } as Required<Patient>,
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
