import { coercePatientCoordinateToNumber } from './data/coerce-patient-coordinate-to-number';
import { patientDataLoader } from './data/patient-data-loader';
import { scoreListOfPatients } from './services/score-list-of-patients';
import { TPatientRecordWithScore } from './types/patient-record';
import { validateCoordinate } from './validators/coordinates';

export function listOfWeightedPatients(
  latitude: number,
  longitude: number
): TPatientRecordWithScore[] {
  const result = validateCoordinate(latitude, longitude);

  if (!result) {
    throw new Error('latitude or longitude is not valid');
  }

  const listOfPatients = patientDataLoader();

  const patientsFixedLocationType = listOfPatients.map((patient) => {
    return {
      ...patient,
      location: coercePatientCoordinateToNumber(
        patient.location.latitude,
        patient.location.longitude
      ),
    };
  });

  const top10patientsForAGivenPoint = scoreListOfPatients(
    patientsFixedLocationType as TPatientRecordWithScore[],
    { latitude, longitude }
  );

  return top10patientsForAGivenPoint;
}
