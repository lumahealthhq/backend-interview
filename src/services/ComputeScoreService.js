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

    const newPatients = patients.map(patient => {
      let score = 0;
      for (const data in SCORE_DATA) {
        score += SCORE_DATA[data].weight * patient[data];
      }
      return { ...patient, score };
    });

    return newPatients;
  }
}

module.exports = ComputeScoreService;
