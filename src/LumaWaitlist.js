var geolib = require('geolib');
var stats = require('simple-statistics');
var gaussian = require('gaussian');
var METERS_TO_MILES = 0.000621371;

class LumaWaitlist {
  /**
   * Make de class. Setup constants.
   */
  constructor() {
    this.statWeight = {
      AGE: .10,
      DISTANCE: .10,
      CANCELLATION_RATE: .60,
      REPLY_TIME: .20
    };
    this.MULLIGANS = 20;
  }

  /**
   * Initialize the model with a body of patient data.
   *
   * So far this just creates gaussian distributions for ReplyTimes and CancellationRates.
   * But it also save patients to generate the LumaWaitList
   *
   * @param patients
   */
  init(patients) {
    this.patients = patients;

    var replyTimes = [];
    var cancellationRates = [];
    var totalOffers = [];
    for (var patient of patients) {
      replyTimes.push(patient.averageReplyTime);
      var cancellationRate = patient.canceledOffers / (patient.acceptedOffers + patient.canceledOffers);
      if (isFinite(cancellationRate) && !isNaN(cancellationRate))
        cancellationRates.push(cancellationRate);
      totalOffers.push(patient.acceptedOffers + patient.canceledOffers);
    }

    this.distributionOfAverageReplyTimes = gaussian(stats.mean(replyTimes), stats.variance(replyTimes));
    this.distributionOfCancellationRates = gaussian(stats.mean(cancellationRates), stats.variance(cancellationRates));
  }

  /**
   * Get the 10 patients that are most likely to respond.
   *
   * @param latitude
   * @param longitude
   */
  getWaitlist({latitude, longitude}) {
    scores.sort((a, b) => {
    })

  }

  /**
   * The overall weight of each component is defined by the requirements.
   * The contribution of each component is the subject of hypothesis and testing.
   *
   * @param patient
   */
  scorePatient(patient, practice) {
    try {
      var ageScore = this.statWeight.AGE * this.scoreAge(patient);
      var distanceScore = this.statWeight.DISTANCE * this.scoreDistance(patient, practice);
      var replyTimeScore = this.statWeight.REPLY_TIME * this.scoreReplyTime(patient);
      var cancellationRateScore =
        ((patient.acceptedOffers + patient.canceledOffers) < this.MULLIGANS) ? 100 :
          this.scoreCancellationRate(patient);
      cancellationRateScore *= this.statWeight.CANCELLATION_RATE;

      return (ageScore + distanceScore + cancellationRateScore + replyTimeScore);
    } catch (err) {
      if (err.message == 'patient.is.a.minor')
        return 0;
      if (err.message == 'patient.too.far')
        return 0;
      throw err;
    }
  }

  /**
   * Age relates to overall responsibility and life circumstances that compete for attention.
   *
   * Likely related to other variables like distance and type of care.
   * ie. Less likely that older people will travel longer distances for general practice care.
   *
   * @param patient
   */
  scoreAge({age}) {
    // Should not schedule a minor.
    if (age <= 18)
      throw new Error('patient.is.a.minor');

    // College. Free time. Not as constrained. Will skip class.
    var score;
    if (age <= 24)
      score = 100;

    // Young adult. No children. Career responsibilities.
    else if (age <= 34)
      score = 50;

    // Married with children. Hard to adjust schedules.
    else if (age <= 44)
      score = 30;

    // Married with children. Children mostly independent.
    else if (age <= 54)
      score = 50;

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
    var score = 50 - Math.pow(((miles - 26) / 7), 3);
    score = Math.trunc(Math.max(Math.min(100, score), 0));
    if (score == 0)
      throw new Error('patient.too.far');
    return score;
  }

  /**
   * We use a distributionOfAverageReplyTimes to score the reply time.
   * cdf returns the probability of a random data point falling in the interval
   * from -infinity to the given averageReplyTime. We give a big score for those
   * that respond quickly.
   *
   * @param averageReplyTime
   */
  scoreAverageReplyTime({averageReplyTime}) {
    return Math.round(100 - 100 * this.distributionOfAverageReplyTimes.cdf(averageReplyTime));
  }

  /**
   * The number of acceptances cannot be normalized against other patients by itself
   * since a patient may be brand new or returning for many years.
   *
   * The same is true for number of cancellations.
   *
   * Because canceledOffers is greater than acceptedOffers, I assume that canceledOffers is a misnomer
   * since cancellations should never be more than acceptances.
   */
  scoreCancellationRate({canceledOffers, acceptedOffers}) {
    var cancellationRate = canceledOffers / (acceptedOffers + canceledOffers);
    return Math.round(100 - 100 * this.distributionOfCancellationRates.cdf(cancellationRate));
  }
}


module.exports = LumaWaitlist;