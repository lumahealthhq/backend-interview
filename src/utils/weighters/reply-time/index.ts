import { TPatientRecordWithScore } from '../../../types/patient-record';
import { byLowestValue } from '../lib/by-lowest-value';
import { RecordWithScore } from '../types';

export function byReplyTime(
  patients: TPatientRecordWithScore[]
): TPatientRecordWithScore[] {
  const scored = byLowestValue(
    patients as unknown as RecordWithScore[],
    'averageReplyTime',
    2
  );

  return scored as unknown as TPatientRecordWithScore[];
}
