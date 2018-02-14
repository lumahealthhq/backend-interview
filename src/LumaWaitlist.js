var geolib = require('geolib');
var METERS_TO_MILES = 0.000621371;

class LumaWaitlist {
  constructor(patientData) {
    this.patientData = patientData;
    this.statWeight = {
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
      var ageScore = this.statWeight.AGE * this.scoreAge(patient);
      var distanceScore = this.statWeight.DISTANCE * this.scoreDistance(patient);
      var acceptedOffersScore = this.statWeight.ACCEPTED_OFFERS * this.scoreAcceptedOffers(patient);
      var cancelledOffersScore = this.statWeight.CANCELLED_OFFERS * this.scoreCancelledOffers(patient);
      var replyTimeScore = this.statWeight.REPLY_TIME * this.scoreReplyTime(patient);

      return (ageScore + distanceScore + acceptedOffersScore + cancelledOffersScore + replyTimeScore) / 100;
    } catch (err) {
      if (err.message == 'patient.is.a.minor')
        return 0;
      throw err;
    }
  }

  /**
   * Age relates to overall responsibility and life circumstances that compete for attention.
   * Likely related to other variables like distance and type of care.
   *
   * ie. Less likely that older people will travel longer distances for general practice care.
   *
   * @param patient
   */
  scoreAge({age}) {
    // Should not schedule a minor.
    if (age <= 18)
      throw new Error('patient.is.a.minor');

    // College. Not as responsible, but health concerns probably acute.
    var score;
    if (age <= 24)
      score = 50;

    // Young adult. No children. Early career. Unsettled. Easily distracted.
    else if (age <= 34)
      score = 30;

    // Married with children. Younger children. Less time. More easily distracted / likely to miss or cancel.
    else if (age <= 44)
      score = 50;

    // Married with children. Mature children. Prime time for career.
    else if (age <= 54)
      score = 60;

    // Senior. Increasing concern for health. Stable career. Fewer family oblications.
    else if (age <= 64)
      score = 80;

    // Retiree... lots of time. Health is #1 priority.
    else
      score = 100;

    // return normalized score;
    return Math.trunc(100 * (score - 30) / 70);
  }

  /**
   * Also a bit of a step function.
   *
   * People within an inner limit will be positively motivated by distance.
   * People outside an inner limit will be negatively motivated by distance.
   * People outside the outher limit will not come at all.
   *
   * This gets more complex when considering other hospitals nearby and optiosn for care.
   * Also traffic. Is the person at work / home when the appt. is scheduled. Etc.
   *
   * score = 50 - ((dist-26)/7)^3 assigns...
   *     0% (worst) score to a patient that lives ~58 miles away.
   *     40% (bad) score to to a patient that lives ~40 miles away.
   *     50% (average) score to a patient that lives ~26 miles away.
   *     60% (good) score to to a patient that lives ~10 miles away.
   *     100% (best) score to a patient that lives ~0 miles away.
   *
   * @param patient
   * @param practice
   *
   * Both must have...
   *    latitude <float>
   *    longitude <float>
   */
  scoreDistance(patient, practice) {
    var meters = geolib.getDistanceSimple(patient, practice);
    var miles = meters * METERS_TO_MILES;
    var score = 50 - Math.pow(((miles - 26) / 7),  3);
    return Math.trunc(Math.max(Math.min(100, score), 0));
  }
}


module.exports = LumaWaitlist;