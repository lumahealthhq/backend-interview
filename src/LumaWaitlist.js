class LumaWaitlist {
  constructor(patientData) {
    this.patientData = patientData;
    this.statWeights = {
      AGE: 10,
      DISTANCE: 10,
      ACCEPTED_OFFERS: 30,
      CANCELLED_OFFERS: 30,
      REPLY_TIME: 20
    };
  }

  getPatients({latitude, longitude}) {

  }

  /**
   * The overall weight of each component is defined by the requirements.
   * The contribution of each component is the subject of hypothesis and testing.
   *
   * @param patient
   */
  score(patient) {
    try {
      var ageScore = this.statWeights.AGE * this.scoreAge(patient);
      var distanceScore = this.statWeights.DISTANCE * this.scoreDistance(patient);
      var acceptedOffersScore = this.statWeights.ACCEPTED_OFFERS * this.scoreAcceptedOffers(patient);
      var cancelledOffersScore = this.statWeights.CANCELLED_OFFERS * this.scoreCancelledOffers(patient);
      var replyTimeScore = this.statWeights.REPLY_TIME * this.scoreReplyTime(patient);

      return (ageScore + distanceScore + acceptedOffersScore + cancelledOffersScore + replyTimeScore) / 100;
    } catch (err) {
      if (err.message == 'patient.is.a.minor')
        return 0;
      throw err;
    }
  }

  /**
   * Age relates to overall responsibility and life circumstances that compete for attention.
   *
   * @param patient
   */
  scoreAge(patient) {
    // Should not schedule a minor.
    if (patient.age <= 18)
      throw new Error('patient.is.a.minor');

    // College. Not as responsible, but health concerns probably acute.
    var score;
    if (patient.age <= 24)
      score = 50;

    // Young adult. No children. Early career. Unsettled. Easily distracted.
    else if (patient.age <= 34)
      score = 30;

    // Married with children. Younger children. Less time. More easily distracted / likely to miss or cancel.
    else if (patient.age <= 44)
      score = 50;

    // Married with children. Mature children. Prime time for career.
    else if (patient.age <= 54)
      score = 60;

    // Senior. Increasing concern for health. Stable career. Fewer family oblications.
    else if (patient.age <= 64)
      score = 80;

    // Retiree... lots of time. Health is #1 priority.
    else
      score = 100;

    // return normalized score;
    return Math.trunc(100 * (score - 30) / 70);
  }
}


module.exports = LumaWaitlist;