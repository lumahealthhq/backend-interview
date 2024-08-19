import Patient from "../../../@types/patient"
import { ScoredPatient } from "../../../@types/scored-patient"
import bayesEstimator from "../../../utils/math/bayes"
import { SetStats } from "./get-set-stats.usecase"

export default class PatientsScorerUsecase {
  private patients: Patient[]
  private stats: SetStats

  constructor(patients: Patient[], stats: SetStats) {
    this.patients = patients
    this.stats = stats
  }

  execute(): ScoredPatient[] {
    const scoredAgeAndReplyTime = this.scoreAgeAndReplyTime(this.patients)
    const fullyScored = this.scoreOffers(scoredAgeAndReplyTime)
    const normalized = this.normalizeScore(fullyScored)

    return normalized
  }

  private scoreAgeAndReplyTime(patients: Patient[]): Omit<ScoredPatient, 'offersScore' | 'lowDataBonus'>[] {
    const scoredPatients = []

    for (const patient of patients) {
      // normalized to zscores
      const scoredPatient = {
        ...patient,
        ageScore: (patient.age - this.stats.age.mean) / this.stats.age.mean,
        replyTimeScore: (patient.averageReplyTime - this.stats.replyTime.mean) / this.stats.replyTime.mean,
      }

      scoredPatients.push(scoredPatient)
    }

    return scoredPatients
  }

  private scoreOffers(scoredPatients: any): ScoredPatient[] {
    // calculating the raw scores of the patient
    for (const patient of scoredPatients) {
      patient.offersScore = bayesEstimator(
        this.stats.offer.meanNumberOfOffers / 4,
        this.stats.offer.medianAcceptance,
        patient.acceptedOffers,
        patient.acceptedOffers + patient.canceledOffers
      )
    }

    // calculating the mean and the min/max values for the new raw offer scores
    this.stats.offer.mean = 0
    this.stats.offer.std = 0
    for (const patient of scoredPatients) this.stats.offer.mean += patient.offersScore
    this.stats.offer.mean /= scoredPatients.length

    // calculating the standard deviation of the new raw offer scores
    for (const patient of scoredPatients) {
      this.stats.offer.std += Math.pow(patient.offersScore - this.stats.offer.mean, 2)
    }
    this.stats.offer.std /= scoredPatients.length
    this.stats.offer.std /= Math.sqrt(this.stats.offer.std)

    // calculating the final (unnormalized) offer score
    for (const patient of scoredPatients) patient.offersScore = (patient.offersScore - this.stats.offer.mean) / this.stats.offer.mean

    return scoredPatients
  }

  private normalizeScore(patients: ScoredPatient[]): ScoredPatient[] {
    const minMax = this.getMinMaxFromScoresUsecase(patients)

    for (const patient of patients) {
      patient.ageScore = (patient.ageScore - minMax.age.min) / (minMax.age.max - minMax.age.min)
      patient.offersScore = (patient.offersScore - minMax.offer.min) / (minMax.offer.max - minMax.offer.min)
      patient.replyTimeScore = (patient.replyTimeScore - minMax.replyTime.min) / (minMax.replyTime.max - minMax.replyTime.min)
    }

    return patients
  }

  private getMinMaxFromScoresUsecase(patients: ScoredPatient[]): MinMaxScores {
    const minMax: MinMaxScores = {
      age: {
        min: Infinity,
        max: -Infinity,
      },
      offer: {
        min: Infinity,
        max: -Infinity,
      },
      replyTime: {
        min: Infinity,
        max: -Infinity,
      }
    }

    for (const patient of patients) {
      if (patient.ageScore < minMax.age.min) minMax.age.min = patient.ageScore
      if (patient.ageScore > minMax.age.max) minMax.age.max = patient.ageScore

      if (patient.offersScore < minMax.offer.min) minMax.offer.min = patient.offersScore
      if (patient.offersScore > minMax.offer.max) minMax.offer.max = patient.offersScore

      if (patient.replyTimeScore < minMax.replyTime.min) minMax.replyTime.min = patient.replyTimeScore
      if (patient.replyTimeScore > minMax.replyTime.max) minMax.replyTime.max = patient.replyTimeScore
    }

    return minMax
  }
}

interface MinMaxScores {
  age: {
    min: number;
    max: number;
  }
  offer: {
    min: number;
    max: number;
  }
  replyTime: {
    min: number;
    max: number;
  }
}
