/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/**
 * Service responsible for calculating the probability of attending appointments score of each patient
 */
class ComputeScoreService {
  /**
   * Execute the service
   * @param {Object[]} patients List of patients with normalized data
   * @returns {Object[]} patientsWithScore List of patients with the score calculated
   */
  execute(patients) {
    // Object containing the weights of each feature
    const SCORE_DATA = {
      age: { weight: 0.1 },
      acceptedOffers: { weight: 0.3 },
      canceledOffers: { weight: 0.3 },
      averageReplyTime: { weight: 0.2 },
      distanceToFacility: { weight: 0.1 },
    };

    // Calculating the score of the normalized data of each feature for \
    // all patients and adding the calculated score to the object
    const patientsWithScore = patients.map((patient) => {
      let score = 0;
      for (const data in SCORE_DATA) {
        score += SCORE_DATA[data].weight * patient.normalizedData[data];
      }
      const behaviorScore =
        patient.normalizedData.acceptedOffers +
        patient.normalizedData.canceledOffers +
        patient.normalizedData.averageReplyTime;

      const demographicScore =
        patient.normalizedData.age + patient.normalizedData.distanceToFacility;

      return {
        ...patient,
        score: (10 * score).toFixed(2),
        behaviorScore: behaviorScore.toFixed(2),
        demographicScore: demographicScore.toFixed(2),
      };
    });

    return patientsWithScore;
  }
}

module.exports = ComputeScoreService;
