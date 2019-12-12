const { getDistance } = require('geolib');

class PatientScorer {
  call(patient, facilityLocation) {
    return this.calculatePatientScore(patient, facilityLocation);
  }

  get categories() {
    return {
      age: { weight: 0.1, positive: false },
      distance: { weight: 0.1, positive: false },
      acceptedOffers: { weight: 0.3, positive: true },
      canceledOffers: { weight: 0.3, positive: false },
      averageReplyTime: { weight: 0.2, positive: false },
    };
  }

  calculatePatientScore(patient, facilityLocation) {
    const { location } = patient;
    const distance = getDistance(location, facilityLocation, 1);

    let score = 0;

    const { age, acceptedOffers, canceledOffers, averageReplyTime } = patient;
    const { categories } = this;

    score -= distance * categories.distance.weight;
    score -= age * categories.age.weight;
    score += acceptedOffers * categories.acceptedOffers.weight;
    score -= canceledOffers * categories.canceledOffers.weight;
    score -= averageReplyTime * categories.averageReplyTime.weight;

    return score;
  }
}

module.exports = new PatientScorer();
