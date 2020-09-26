/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
class ComputeScoreService {
  execute(patients) {
    const SCORE_DATA = {
      age: { weight: 0.1 },
      acceptedOffers: { weight: 0.3 },
      canceledOffers: { weight: 0.3 },
      averageReplyTime: { weight: 0.2 },
      distanceToFacility: { weight: 0.1 },
    };

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
