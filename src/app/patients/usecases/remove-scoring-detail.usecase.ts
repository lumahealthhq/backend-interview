import { ScoredPatient } from "../../../@types/scored-patient";

export default function removeDetailUsecase(scoredPatients: Required<ScoredPatient>[]) {
  const patients: Partial<ScoredPatient>[] = scoredPatients.map(patient => ({...patient}))

  for (const patient of patients) {
    delete patient.ageScore
    delete patient.offersScore
    delete patient.locationScore
    delete patient.replyTimeScore

    delete patient.age
    delete patient.location
    delete patient.averageReplyTime
    delete patient.acceptedOffers
    delete patient.canceledOffers
  }

  return patients
}
