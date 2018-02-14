/*
input: patient demographics and behavior data in json file
output: a score for each patient (1 as lowest, 10 as highest) that reps the chance a patient accepting the offer off the waitlist

if a patient doesn't have much behavior data, should be randomly added to the top list to give them a chance to be selected
*/

const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);

const calculatePatientScores = (facilityLat, facilityLong) => {
  //age (yrs), acceptedOffers (int), cancelledOffers(int), replyTime(int, s)
  //weights
  const ageWeight = 0.1;
  const distanceToFacilityWeight = 0.1;
  const numAcceptedOffersWeight = 0.3;
  const numCanceledOffersWeight = 0.3;
  const avgReplyTimeWeight = 0.2;

  const filePath = './sample-data/patients.json';
  const insuffientDataThreshold = 20;

  const results = {
    sufficientData: [],
    insufficientData: [],
  }
  //hardcoded for now, but these would be normally taken from generateBaseline.js
  const baselineBuckets = {
    age: [21, 35, 45, 55, 65],
    distanceToFacility: [0, 3000, 6000, 9000, 12000], //in m
    numAcceptedOffers: [0, 8, 19, 29, 39, 48, 59, 69, 79, 89 ],
    numCanceledOffers: [0, 10, 21, 30, 41, 51, 60, 72, 82, 91 ],
    avgReplyTime: [1, 377, 738, 1073, 1456, 1774, 2112, 2516, 2938, 3251],
  }

  const patientScore = {};

  return new Promise ((resolve) => {
    resolve(readFile(filePath, 'utf8')
    .then((data) => {
      let patientsData = JSON.parse(data);

      //for each patient, find score for each category
      for (var patient of patientsData) {

        if ((patient.acceptedOffers + patient.canceledOffers) < insuffientDataThreshold) {
          results.insufficientData.push({
            id: patient.id,
            name: patient.name
          })
        } else {
          //patients that are retired are more likely to be flexible with their schedule, and are more likely to take an open spot
          let ageBucket = findBucket(baselineBuckets.age, patient.age)
          patientScore.age = (ageBucket * 2) * ageWeight; 
    // console.log(`age score: ${patientScore.age}`)
          let dist = calcDistBetweenGPSCoord(patient.location.latitude, patient.location.longitude, facilityLat, facilityLong);
          // console.log(`dist: ${dist}`)
          let distanceBucket = findBucket(baselineBuckets.distanceToFacility, dist)
          // console.log(`dist bucket: ${distanceBucket}`)

          if (distanceBucket === 1) {
            patientScore.distanceToFacility = 10 * distanceToFacilityWeight;
          } else if (distanceBucket === 2) {
            patientScore.distanceToFacility = 8 * distanceToFacilityWeight;
          } else if (distanceBucket === 3) {
            patientScore.distanceToFacility = 6 * distanceToFacilityWeight;
          } else if (distanceBucket === 4) {
            patientScore.distanceToFacility = 4 * distanceToFacilityWeight;
          } else if (distanceBucket === 5) {
            patientScore.distanceToFacility = 2 * distanceToFacilityWeight;
          }
          // console.log(`dist score: ${patientScore.distanceToFacility}`)
          let numAcceptedOffersBucket = findBucket(baselineBuckets.numAcceptedOffers, patient.acceptedOffers)
          patientScore.numAcceptedOffers = numAcceptedOffersBucket * numAcceptedOffersWeight;
    // console.log(`numAcceptedOffersBucket: ${numAcceptedOffersBucket}`)      
    // console.log(`numAcceptedOffersBucket score: ${patientScore.numAcceptedOffers}`)
          let numCanceledOffersBucket = findBucket(baselineBuckets.numCanceledOffers, patient.canceledOffers)
          patientScore.numCanceledOffers = numCanceledOffersBucket * numCanceledOffersWeight;
    // console.log(`numCanceledOffersBucket score: ${patientScore.numCanceledOffers}`)
          let avgReplyTimeBucket = findBucket(baselineBuckets.avgReplyTime, patient.averageReplyTime)
          patientScore.avgReplyTime = avgReplyTimeBucket * avgReplyTimeWeight;
    // console.log(`avgReplyTimeBucket score: ${patientScore.avgReplyTime}`)
          //sum each weighted category to find total score
          let total = 0;
          for (var categoryScore of Object.keys(patientScore)) {
            total += patientScore[categoryScore];
            // console.log(patientScore[categoryScore])
          }
          results.sufficientData.push({
            id: patient.id,
            name: patient.name,
            score: total,
          })
          // console.log(patientScore)

          // console.log(`patient total score: ${total}`)
        }
      }
      return results;
    }))
  })
}

const findBucket = (category, target) => {
  var i = 0;
  for (i; i < category.length; i++) {
    if (target >= category[i] && target < category[i+1]) {
      return i + 1;
    }
  }
  return category.length;
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

// convert from degrees to radians
Math.toRadians = (degrees) => {
  return degrees * Math.PI / 180;
}

module.exports = {
  calculatePatientScores,
  calcDistBetweenGPSCoord,
}