import { TPatientRecordWithScore } from '../../../types/patient-record';
import { byHighestValue } from '../lib/by-highest-value';
import { RecordWithScore } from '../types';

export function byAcceptedOffers(
  patients: TPatientRecordWithScore[]
): TPatientRecordWithScore[] {
  const scored = byHighestValue(
    patients as unknown as RecordWithScore[],
    'acceptedOffers',
    3
  );

  return scored as unknown as TPatientRecordWithScore[];
}
