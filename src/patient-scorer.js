import getDistance from 'geolib/es/getDistance';

const MAX_NUM_OFFERS_FOR_NEW_PATIENT = 20;

export default class PatientScorer {

  static getHistoricalScoreForPatient(patientRecord) {
    let score = 0;
    for (const [feature, featureInfo] of Object.entries(STATIC_FEATURES)) {
      score += featureInfo.evaluator(patientRecord[feature]) * featureInfo.weight;
    }
    return score;
  }

  static getDynamicScoreForPatient(patientRecord, data) {
    let score = 0;
    for (const [feature, featureInfo] of Object.entries(DYNAMIC_FEATURES)) {
      score += featureInfo.evaluator(patientRecord[feature], data[feature]) * featureInfo.weight;
    }
    return score;
  }

  static getNormalizedScoreForAge(age) {
    return age < 65 ? 10 : 5;
  }

  static getNormalizedScoreForAcceptedOffers(numAcceptedOffers) {
    if (PatientScorer._getShouldBumpPatientByNumOffers(numAcceptedOffers)) {
      return 10;
    }
    return Math.min(10, Math.max(1, numAcceptedOffers / 10));
  }

  static getNormalizedScoreForCanceledOffers(numCanceledOffers) {
    if (PatientScorer._getShouldBumpPatientByNumOffers(numCanceledOffers)) {
      return 10;
    }
    return Math.max(1, 10 - Math.min(10, numCanceledOffers / 10));
  }

  static getNormalizedScoreForAverageReplyTime(avgReplyTime) {
    const minutes = avgReplyTime / 60;
    return minutes < 10 ? 10 : 5;
  }

  static getNormalizedScoreForDistance(patientLocation, clinicLocation) {
    const distance = getDistance(patientLocation, clinicLocation);
    return distance < 10000 ? 10 : 5;
  }

  /**
   * Returns whether or not this patient has a low number of offers and if so,
   * whether or not they should be randomly bumped up
   * @param numOffers
   * @returns {boolean}
   * @private
   */
  static _getShouldBumpPatientByNumOffers(numOffers) {
    if (numOffers < MAX_NUM_OFFERS_FOR_NEW_PATIENT) {
      return Math.random() < 0.5;
    }
    return false;
  }
}

const STATIC_FEATURES = {
  age: {
    evaluator: PatientScorer.getNormalizedScoreForAge,
    weight: 0.1
  },
  acceptedOffers: {
    evaluator: PatientScorer.getNormalizedScoreForAcceptedOffers,
    weight: 0.3
  },
  canceledOffers: {
    evaluator: PatientScorer.getNormalizedScoreForCanceledOffers,
    weight: 0.3
  },
  averageReplyTime: {
    evaluator: PatientScorer.getNormalizedScoreForAverageReplyTime,
    weight: 0.2
  }
};

const DYNAMIC_FEATURES = {
  location: {
    evaluator: PatientScorer.getNormalizedScoreForDistance,
    weight: 0.1
  }
};