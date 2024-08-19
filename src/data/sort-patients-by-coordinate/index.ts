import { TPatientRecord } from '../../types/patient-record';

export type SortedPatients = {
  nw: TPatientRecord[];
  ne: TPatientRecord[];
  sw: TPatientRecord[];
  se: TPatientRecord[];
};

export function sortPatientsByCoordinate(
  patients: TPatientRecord[]
): SortedPatients {
  const sortedPatients: SortedPatients = { nw: [], ne: [], sw: [], se: [] };

  for (const patient of patients) {
    if (patient.location.longitude >= 0 && patient.location.latitude >= 0) {
      sortedPatients.nw.push(patient);
    } else if (
      patient.location.longitude >= 0 &&
      patient.location.latitude < 0
    ) {
      sortedPatients.ne.push(patient);
    } else if (
      patient.location.longitude < 0 &&
      patient.location.latitude >= 0
    ) {
      sortedPatients.sw.push(patient);
    } else {
      sortedPatients.se.push(patient);
    }
  }

  return sortedPatients;
}
