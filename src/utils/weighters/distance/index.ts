import { TCoordinates } from '../../../types/coordinates';
import {
  TPatientRecordWithScore,
  TPatientRecordWithScoreAndDistance,
} from '../../../types/patient-record';
import { distanceBetweenTwoPoints } from '../../distance-between-two-points';
import { byLowestValue } from '../lib/by-lowest-value';
import { RecordWithScore } from '../types';

export function byDistance(
  patients: TPatientRecordWithScore[],
  practiceLocation: TCoordinates
): TPatientRecordWithScore[] {
  const patientsWithDistance = patients.map((patient) => ({
    ...patient,
    distance: distanceBetweenTwoPoints(patient.location, practiceLocation),
  })) as TPatientRecordWithScoreAndDistance[];

  const scored = byLowestValue(
    patientsWithDistance as unknown as RecordWithScore[],
    'distance',
    0.1
  );

  return scored as unknown as TPatientRecordWithScore[];
}
