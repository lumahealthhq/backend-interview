/**
 * luma-priority
 * https://github.com/rwibawa/luma-priority
 *
 * Copyright (c) 2017 Ryan Wibawa
 * Licensed under the MIT license.
 */

const geolib = require('geolib');

const ping = function() {
  return 'pong';
}

const getDistanceInMile = function(location1, location2) {
  var distanceInMeters = geolib.getDistanceSimple(location1, location2);
  return geolib.convertUnit('mi', distanceInMeters, 0);
}

const scoreAge = function(age) {
  // age n=21 is the lowest (score=1)
  // age m=90 is the lowest (score=10)
  var n=21, m=91, range=(m-n)/10;
  return Math.floor((age-n)/range)+1;
}

const scoreAcceptedOffers = function(acceptedOffers) {
  // acceptedOffers n=0 is the lowest (score=1)
  // acceptedOffers m=100 is the lowest (score=10)
  var n=0, m=101, range=(m-n)/10;
  return Math.floor((acceptedOffers-n)/range)+1;
}

const scoreCanceledOffers = function(canceledOffers) {
  // canceledOffers n=100 is the lowest (score=1)
  // canceledOffers m=0 is the highest (score=10)
  var n=0, m=101, range=(m-n)/10;
  return 10 - Math.floor((canceledOffers-n)/range);
}

const scoreAverageReplyTime = function(averageReplyTime) {
  // averageReplyTime n=1 is the highest (score=1)
  // averageReplyTime m=3600 is the lowest (score=10)
  var n=1, m=3601, range=(m-n)/10;
  return 10 - Math.floor((averageReplyTime-n)/range);
}

const scoreDistance = function(distance) {
  // distance n=10 is the lowest (score=1)
  // distance m=0 is the highest (score=10)
  var n=0, m=11, range=(m-n)/10;
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

  return patientScore;
}

module.exports = {
  ping,
  getDistanceInMile,
  scoreAge,
  scoreAcceptedOffers,
  scoreCanceledOffers,
  scoreAverageReplyTime,
  scoreDistance,
  scorePatient
};
