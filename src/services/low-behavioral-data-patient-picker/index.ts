import { TPatientRecord } from '../../types/patient-record';

export function lowBehavioralDataPatientPicker(
  patients: TPatientRecord[]
): TPatientRecord[] {
  const possibleFields = ['acceptedOffers', 'canceledOffers'];

  const selectedFieldToSortBy = possibleFields[
    Math.floor(Math.random() * possibleFields.length)
  ] as string;

  const sorted = patients
    .sort((patientA: TPatientRecord, patientB: TPatientRecord) => {
      return (
        (patientA[selectedFieldToSortBy as keyof TPatientRecord] as number) -
        (patientB[selectedFieldToSortBy as keyof TPatientRecord] as number)
      );
    })
    .slice(0, 10);

  return sorted;
}
