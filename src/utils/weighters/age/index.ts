import { TPatientRecordWithScore } from '../../../types/patient-record';
import { byAverageOrTargetValue } from '../lib/by-average-or-target-value';
import { RecordWithScore } from '../types';

export function byAge(
  patients: TPatientRecordWithScore[]
): TPatientRecordWithScore[] {
  const scored = byAverageOrTargetValue(
    patients as unknown as RecordWithScore[],
    'age',
    0.1
  ) as unknown as TPatientRecordWithScore[];

  return scored;
}
