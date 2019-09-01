const geolocationUtils = require('./utils/geolocation.utils');
const mathUtils = require('./utils/math.utils');
const commonUtils = require('./utils/common.utils');

const { calculateDistanceBetweenLocations } = geolocationUtils;
const { roundUp, fixDecimals } = mathUtils;
const { isNullOrUndefined } = commonUtils;

exports.calculateScoreByCategory = (value, weighingItem) => {
  if (isNullOrUndefined(value) || isNullOrUndefined(weighingItem)) {
    return 0;
  }

  const { maxPoints = 0, weighingList = [] } = weighingItem;
  const filteredRangeItem = weighingList.find(
    (item) => value >= item.from && value <= item.to
  );

  if (isNullOrUndefined(filteredRangeItem) || isNullOrUndefined(filteredRangeItem.percent)) {
    return 0;
  }

  return (maxPoints / 100) * filteredRangeItem.percent;
};

exports.calculatePatientScore = (patient, facilityLat, facilityLng, weightingCategories, minimunBehaviorValue) => {
  const {
    location,
    age,
    acceptedOffers,
    canceledOffers,
    averageReplyTime
  } = patient;

  // Calculate the distance between the patient and the facility.
  const distance = fixDecimals(calculateDistanceBetweenLocations(
    location.latitude,
    location.longitude,
    facilityLat,
    facilityLng
  ), 2);

  const ageScore = this.calculateScoreByCategory(age, weightingCategories.age);
  const distanceScore = this.calculateScoreByCategory(distance, weightingCategories.distance);
  const acceptedOffersScore = this.calculateScoreByCategory(acceptedOffers, weightingCategories.acceptedOffers);
  const canceledOffersScore = this.calculateScoreByCategory(canceledOffers, weightingCategories.canceledOffers);
  const averageReplyTimeScore = this.calculateScoreByCategory(averageReplyTime, weightingCategories.replyTime);

  let hasEnoughBehaviorData = true;
  // Considering that patients who have little behavior data should be randomly added
  // to the top list as to give them a chance to be selected
  if (acceptedOffers + canceledOffers <= minimunBehaviorValue) {
    hasEnoughBehaviorData = false;
  }

  const score = ageScore + distanceScore + acceptedOffersScore + canceledOffersScore + averageReplyTimeScore;

  return {
    ...patient,
    score: roundUp(score, 1),
    hasEnoughBehaviorData
  };
};
