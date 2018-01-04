/**
 * luma-priority
 * https://github.com/lumahealthhq/luma-priority
 *
 * Copyright (c) 2017 Ryan Wibawa
 * Licensed under the MIT license.
 */

const geolib = require('geolib'),
  binarySearchInsert = require('binary-search-insert'),
  lowDataThreshold = 5
  lowDataReplyTimeThreshold = 300; // 5 minutes

const ping = function() {
  return 'pong';
}

const getDistanceInMile = function(location1, location2) {
  var distanceInMeters = geolib.getDistanceSimple(location1, location2);
  return geolib.convertUnit('mi', distanceInMeters, 0);
}

const scoreAge = function(age) {
  // age n=21 is the lowest (score=1)
  // age m=90 is the highest (score=10)
  var n=21, m=90, range=(m+1-n)/10;
  return Math.floor((age-n)/range)+1;
}

const scoreAcceptedOffers = function(acceptedOffers) {
  // acceptedOffers n=0 is the lowest (score=1)
  // acceptedOffers m=100 is the highest (score=10)
  var n=0, m=100, range=(m+1-n)/10;
  return Math.floor((acceptedOffers-n)/range)+1;
}

const scoreCanceledOffers = function(canceledOffers) {
  // canceledOffers m=100 is the lowest (score=1)
  // canceledOffers n=0 is the highest (score=10)
  var n=0, m=100, range=(m+1-n)/10;
  return 10 - Math.floor((canceledOffers-n)/range);
}

const scoreAverageReplyTime = function(averageReplyTime) {
  // averageReplyTime n=1 is the highest (score=1)
  // averageReplyTime m=3600 is the lowest (score=10)
  var n=1, m=3600, range=(m+1-n)/10;
  return 10 - Math.floor((averageReplyTime-n)/range);
}

const scoreDistance = function(distance) {
  // distance m=>10 is the lowest (score=1)
  // distance n=0 is the highest (score=10)
  var n=0, m=10, range=(m+1-n)/10;
  var score = Math.floor((distance-n)/range);
  if (score > 9) {
    score = 9;
  }

  return 10 - score;
}

/*
 * Patient:
 *   {
    "id": "541d25c9-9500-4265-8967-240f44ecf723",
    "name": "Samir Pacocha",
    "location": {
      "latitude": "46.7110",
      "longitude": "-63.1150"
    },
    "age": 46,
    "acceptedOffers": 49,
    "canceledOffers": 92,
    "averageReplyTime": 2598
  } 
 */

const scorePatient = function(patient, facilityLocation) {
  var distanceInMile = getDistanceInMile(facilityLocation, patient.location);
  var ageScore = scoreAge(patient.age),
    acceptedOffersScore = scoreAcceptedOffers(patient.acceptedOffers),
    cancelledOffersScore = scoreCanceledOffers(patient.canceledOffers),
    averageReplyTimeScore = scoreAverageReplyTime(patient.averageReplyTime),
    distanceScore = scoreDistance(distanceInMile);
  var patientScore = (ageScore*10 + distanceScore*10 + acceptedOffersScore*30 + cancelledOffersScore*30 + averageReplyTimeScore*20) / 100;

  return Math.floor(patientScore+.5);
}

const isLowDataPatient = function(patient) {
  return patient.acceptedOffers <= lowDataThreshold 
    && patient.canceledOffers <= lowDataThreshold 
    && patient.averageReplyTime <= lowDataReplyTimeThreshold;
}

const comparator = function(insertedPatient, patient) {
  return scorePatient(insertedPatient.patient, insertedPatient.facilityLocation) 
    < scorePatient(patient.patient, patient.facilityLocation);
}

const insertPatient = function(sortedPatients, patient, facilityLocation) {
  return binarySearchInsert(sortedPatients, comparator, 
    {
      "facilityLocation": facilityLocation,
      "patient": patient
    });
}

const filterPatients = function(patients, facilityLocation) {
  var sortedPatients = [],
    lowDataPatients = [];
  
  patients.forEach( p => {
    if (isLowDataPatient(p)) {
      insertPatient(lowDataPatients, p, facilityLocation);
    } else {
      insertPatient(sortedPatients, p, facilityLocation);
    }
  });

  return {
    "sortedPatients": Array.from(sortedPatients, p => p.patient),
    "lowDataPatients": Array.from(lowDataPatients, p => p.patient)
  };
}

module.exports = {
  ping,
  getDistanceInMile,
  scoreAge,
  scoreAcceptedOffers,
  scoreCanceledOffers,
  scoreAverageReplyTime,
  scoreDistance,
  scorePatient,
  isLowDataPatient,
  insertPatient,
  filterPatients
};
