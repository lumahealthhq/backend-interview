const express = require('express');
const database = require('../database');
const Patient = require('../models/Patient');
const geolib = require('geolib');
const helpers = require('../helpers/helpers');
const router = express.Router();

database.initializeMongo();

router.post('/v1/patients/suggestion', async (req, res) => {

  if(!req.body || !req.body.coordinates || !req.body.coordinates.latitude || !req.body.coordinates.longitude){
    res.status(400).json({msg: 'Please inform your location\'s latitude and longitude'});
  }

  let patientsDB = await Patient.find()
    .catch( (err) => {
      res.status(500).json({msg: 'Could not complete the request. Try again later.'});
    });

  let patients = JSON.parse(JSON.stringify(patientsDB));

  for (let i = 0; i < patients.length; i++) {
    patients[i].distanceToFacility = geolib.getDistance(req.body.coordinates, patients[i].location, 1);
  }

  const minGrade = 1, maxGrade = 10;
  const ageFactor = 0.1;
  const acceptanceFactor = 0.3;
  const cancelationFactor = 0.3;
  const replyFactor = 0.2;
  const distanceFactor = 0.1;

  const minMaxAge = helpers.findMinMax(patients, 'age');
  const minMaxAcceptedOffers = helpers.findMinMax(patients, 'acceptedOffers');
  const minMaxCanceledOffers = helpers.findMinMax(patients, 'canceledOffers');
  const minMaxAverageReplyTime = helpers.findMinMax(patients, 'averageReplyTime');
  const minMaxDistanceToFacility = helpers.findMinMax(patients, 'distanceToFacility');

  for (let i = 0; i < patients.length; i++) {
    let ageGrade = Math.round(helpers.scaleBetween(patients[i].age, minGrade, maxGrade, minMaxAge[0],minMaxAge[1]));
    let acceptedOffersGrade = Math.round(helpers.scaleBetween(patients[i].acceptedOffers, minGrade, maxGrade, minMaxAcceptedOffers[0],minMaxAcceptedOffers[1]));

    let canceledOffersGrade = Math.round(helpers.scaleBetween(patients[i].canceledOffers, minGrade, maxGrade, minMaxCanceledOffers[0],minMaxCanceledOffers[1]));
    canceledOffersGrade = Math.abs(canceledOffersGrade - maxGrade);

    let averageReplyTimeGrade = Math.round(helpers.scaleBetween(patients[i].averageReplyTime, minGrade, maxGrade, minMaxAverageReplyTime[0],minMaxAverageReplyTime[1]));
    averageReplyTimeGrade = Math.abs(averageReplyTimeGrade - maxGrade);

    let distanceToFacilityGrade = Math.round(helpers.scaleBetween(patients[i].distanceToFacility, minGrade, maxGrade, minMaxDistanceToFacility[0],minMaxDistanceToFacility[1]));

    patients[i].score = Math.round(
      (ageGrade * ageFactor) +
      (acceptedOffersGrade * acceptanceFactor) +
      (canceledOffersGrade * cancelationFactor) +
      (averageReplyTimeGrade * replyFactor) +
      (distanceToFacilityGrade * distanceFactor));

    delete patients[i].distanceToFacility;
  }

  patients.sort((a,b) => ( a.score - b.score) );

  patients = patients.slice(-10);

  res.status(200).json(patients);
});

module.exports = router