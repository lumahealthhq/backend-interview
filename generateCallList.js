/* 
API 
input: facility's location
output: ordered list of 10 patients who will most likely accept the appointment offer. should be also based on their fifo order of when they called in (entered on to the waitlist)
*/

const api = (facilityLocation) => {
  const results = []; //10 patients ordered in most likely to accept

  //special treatment: patient with not enough behavioral data
  //threshold to be set: (acceptedOffers + cancelledOffers ) <= 10
  return results;
}

/*
ALGO
input: patient demographics and behavior data in json file
output: a score for each patient (1 as lowest, 10 as highest) that reps the chance a patient accepting the offer off the waitlist

if a patient doesn't have much behavior data, should be randomly added to the top list to give them a chance to be selected
*/

const calculatePatientScores = (facilityLocation) => {
  //age (yrs), acceptedOffers (int), cancelledOffers(int), replyTime(int, s)

  //weights
  const ageWeight = 0.1;
  const distanceToFacilityWeight = 0.1;
  const numAcceptedOffersWeight = 0.3;
  const numCancelledOffersWeight = 0.3;
  const replyTimeWeight = 0.2;
}

/*
First formula on https://en.wikipedia.org/wiki/Great-circle_distance - law of cosines
*/

const calcDistBetweenGPSCoord = (lat1, long1, lat2, long2) => {
  const earthRadiusM = 6371137; //mean radius of Earth, in m
  const radLat1 = Math.toRadians(lat1);
  const radLat2 = Math.toRadians(lat2);

  let deltaLong = Math.toRadians(Math.abs(long2 - long1));
  let deltaSigma = Math.acos( Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(deltaLong));

  return earthRadiusM * deltaSigma; //distance in m
}

module.exports = {
  api,
}