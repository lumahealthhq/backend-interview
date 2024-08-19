import Patient from "../../@types/patient"
import AppError from '../../domain/error/AppError'
import getSetStatsUsecase from './usecases/get-set-stats.usecase';
import { ScoredPatient } from '../../@types/scored-patient';
import PatientsKdtree from "./patients-kdtree";
import { RecommenderConfig } from "../../domain/patients/patients-recommender-config";
import PatientsScorerUsecase from "./usecases/patients-scorer.usecase";
import generateRecommendListUsecase from "./usecases/generate-recommend-list.usecase";

class PatientsRecommenderAdapter {
  private config!: RecommenderConfig
  private scoredPatients!: ScoredPatient[]
  private lowHistoricalDataPatients!: ScoredPatient[];
  private kdtree!: PatientsKdtree

  constructor() {}

  /**
   * This method: i) computes the "static scores" of all patients and ii) creates the K-d tree.
   *
   * A "static score" is the score of features that do not depend on the hospital information (its location).
   * For instance, the age score is static since it has no relation with the hospital location.
   *
   * The reasoning behind using a K-d tree is explained in-depth in the "Traversing" section in the README.md
   * @param config
   * @param patients
   */
  setup(config: RecommenderConfig, patients: Patient[]) {
    this.config = config

    // Here we calculate the static score of all patients
    this.scoredPatients = this.getPatientsScores(patients)

    // Getting all patients who have little historical data
    // This is needed because its this array we'll use to get low historical data patients and add them to the recommended list.
    this.lowHistoricalDataPatients = this.getLowHistoricalDataPatients(this.scoredPatients)

    // Finally creating the K-d tree using the patients + their computed static scores.
    this.kdtree = new PatientsKdtree(this.scoredPatients, this.config)
  }

  recommend(latitude: number, longitude: number, limit: number): Required<ScoredPatient>[] {
    // Simple check to verify that `setup()` has been called before this method
    if (!this.config || !this.scoredPatients) throw new AppError('You must call setup() before calling recommend!', 500)

    // Simple check that verify that the count of the recommended list is smaller than the total amount of patients
    if (limit > this.scoredPatients.length) {
      throw new AppError('The number of patients in the waitlist is smaller than what you requested in the `limit` query parameter.', 422, {
        requested_limit: limit,
        waitlist_length: this.scoredPatients.length,
      })
    }

    // Getting the top scoring patients given the hospital's latitude and longitude
    const bestScoringPatients = this.kdtree.findPatients(latitude, longitude, limit)

    // Generating the recommended list from the best scoring patients + the low historical data patients
    // This simple adds some randomly selected low historical data patients at the bottom of the recommended list
    // The number of how many low historical data patients to add is determined by `lowDataRecommendedRatio`.
    let recommendedList = generateRecommendListUsecase(
      limit,
      bestScoringPatients,
      this.lowHistoricalDataPatients,
      this.config.lowDataRecommendedRatio,
    )

    // This makes sure that the scores are in the [1, 10] range
    recommendedList = this.readableScores(recommendedList, latitude, longitude)

    return recommendedList
  }

  private getPatientsScores(patients: Patient[]): ScoredPatient[] {
    // In order to calculate the scores, we need some stats on the whole patients set
    // such as the mean value of `age` or the standard deviation of `averageReplyTime`.
    const stats = getSetStatsUsecase(patients)

    // `PatientsScorerUsecase` is the place where we score each patient
    // To learn precisely how scoring is done, check the "Scoring" section in the README.md.
    const patientsScorerUsecase = new PatientsScorerUsecase(patients, stats)
    const scoredPatients = patientsScorerUsecase.execute()

    return scoredPatients
  }

  private readableScores(scoredPatients: Required<ScoredPatient>[], hospitalLat: number, hospitalLong: number): Required<ScoredPatient>[] {
    for (const patient of scoredPatients) {
      if (!patient.score) {
        patient.score = this.kdtree.score(patient, hospitalLat, hospitalLong)

        patient.locationScore = this.kdtree.calculateLocationDistance(
          patient.location.latitude, patient.location.longitude,
          hospitalLat, hospitalLong
        )
      }

      patient.score = 10 - (patient.score * 10)
      patient.locationScore = this.config.weights.location - patient.locationScore
      patient.ageScore *= 10 * this.config.weights.age
      patient.offersScore *= 10 * this.config.weights.offers
      patient.replyTimeScore *= 10 * this.config.weights.replyTime
    }

    return scoredPatients
  }

  private getLowHistoricalDataPatients(patients: ScoredPatient[]): ScoredPatient[] {
    const lowData = []
    for (const patient of patients) {
      if (patient.acceptedOffers + patient.canceledOffers < this.config.lowDataThreshold) {
        lowData.push(patient)
      }
    }

    return lowData
  }
}

export default PatientsRecommenderAdapter
