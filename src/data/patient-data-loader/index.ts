import patientRecords from '../../../sample-data/patients.json';
import { TNotParsedPatientRecord } from '../../types/patient-record';

export function patientDataLoader(): TNotParsedPatientRecord[] {
  return patientRecords;
}
