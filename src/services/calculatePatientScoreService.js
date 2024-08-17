class CalculatePatientScoreService {
  constructor() {
    this.weightingData = {
      age: 0.1,
      facilityDistance: 0.1,
      acceptedOffers: 0.3,
      cancelledOffers: 0.3,
      replyTime: 0.2,
    }
  }

  execute(normalizedPatients) {
    // Fields which have negative impact on score calculation
    const fieldsWithNegativeImpact = ['facilityDistance', 'cancelledOffers', 'replyTime']

    return normalizedPatients.map(patient => {
      let score = 0

      for (const field in this.weightingData) {
        let fieldValue = patient[field];

        // Invert the value for fields that should have a negative impact
        if (fieldsWithNegativeImpact.includes(field)) {
          fieldValue = 1 - fieldValue;
        } 
        score += fieldValue * this.weightingData[field]
      }

      return {
        ...patient,
        score: Math.round(score * 10),
        hasLittleBehaviorData: this._flagLittleBehaviorData(patient)
      }
    })
  }

  _flagLittleBehaviorData(patient) {
    const behaviorDataPositiveThreshold = 0.1
    const behaviorDataNegativeThreshold = 0.9

    const hasLowAcceptedOffers = patient.acceptedOffers <= behaviorDataPositiveThreshold;
    const hasHighCancelledOffers = patient.cancelledOffers >= behaviorDataNegativeThreshold
    const hasHighReplyTime = patient.replyTime >= behaviorDataNegativeThreshold

    // If two or more of these conditions are true, consider it little behavioral data
    const conditionsMet = [hasLowAcceptedOffers, hasHighCancelledOffers, hasHighReplyTime]
      .filter(Boolean).length;

    return conditionsMet >= 2;
  }
}

export default CalculatePatientScoreService