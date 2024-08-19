import Patient from "../../@types/patient";
import { ScoredPatient } from "../../@types/scored-patient";
import PatientsRecommenderAdapter from "../../app/patients/patients-recommender";
import defaultRecommenderConfig, { RecommenderConfig } from "../../domain/patients/patients-recommender-config";

class PatientsRecommender {
  private internalRecommender: PatientsRecommenderAdapter;

  constructor(patients: Patient[], config?: Partial<RecommenderConfig>) {
    this.internalRecommender = new PatientsRecommenderAdapter()

    const completedConfig: RecommenderConfig = {
      ...defaultRecommenderConfig,
      ...config,
    }

    this.internalRecommender.setup(completedConfig, patients)
  }

  /**
   * Will returns the ordered patients most likely to accept a given hospital appointment based on its location (latitude and longitude).
   * @param latitude - Hospital's latitude
   * @param longitude - Hospital's longitude
   * @param count - How many patients to return. Defaults to 10.
   * @returns - A ordered array containing the top patients. Each item in the array contains all the patient data + their scores on each individual feature considered (age, reply time, etc.) and their final score (1 to 10).
   */
  recommend(latitude: number, longitude: number, count = 10): ScoredPatient[] {
    const patients = this.internalRecommender.recommend(latitude, longitude, count)

    return patients
  }
}

export default PatientsRecommender
