import { TPatientRecordWithScore } from '../../../types/patient-record';
import { byMidOrTargetValue } from '../lib/by-mid-or-target-value';
import { RecordWithScore } from '../types';

export function byAge(
  patients: TPatientRecordWithScore[]
): TPatientRecordWithScore[] {
  const scored = byMidOrTargetValue(
    patients as unknown as RecordWithScore[],
    'age',
    1
  ) as unknown as TPatientRecordWithScore[];

  return scored;
}
