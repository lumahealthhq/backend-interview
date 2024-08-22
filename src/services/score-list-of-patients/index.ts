import { TCoordinates } from '../../types/coordinates';
import { TPatientRecordWithScore } from '../../types/patient-record';
import { byAcceptedOffers } from '../../utils/weighters/accepted-offers';
import { byAge } from '../../utils/weighters/age';
import { byCancelledOffers } from '../../utils/weighters/cancelled-offers';
import { byDistance } from '../../utils/weighters/distance';
import { byReplyTime } from '../../utils/weighters/reply-time';
import { lowBehavioralDataPatientPicker } from '../low-behavioral-data-patient-picker';

export function scoreListOfPatients(
  patients: TPatientRecordWithScore[],
  practiceLocation: TCoordinates
): TPatientRecordWithScore[] {
  const scored = byAcceptedOffers(
    byCancelledOffers(
      byReplyTime(byAge(byDistance(patients, practiceLocation)))
    )
  );

  const lowDataPatients = lowBehavioralDataPatientPicker(patients);

  const setOfPatients = scored
    .sort(
      (
        patientA: TPatientRecordWithScore,
        patientB: TPatientRecordWithScore
      ) => {
        return patientB.score - patientA.score;
      }
    )
    .slice(0, 7);

  for (const lowDataPatient of lowDataPatients) {
    // @NOTE: there is the possibility that the same patient is already in the setOfPatients list,
    // so we double check
    const found = setOfPatients.find(
      (patient) => patient.id === lowDataPatient.id
    );

    if (found) {
      continue;
    }

    setOfPatients.unshift(lowDataPatient as TPatientRecordWithScore);

    if (setOfPatients.length === 10) {
      break;
    }
  }

  return setOfPatients;
}
