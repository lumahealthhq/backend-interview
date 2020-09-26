const express = require('express');

const patients = require('../../patients.json');

const {
  ComputePatientsDistanceToFacilityService,
  NormalizeDataService,
  ComputeScoreService,
  GenerateListOfPatientsService,
} = require('../services/index');

const routes = express.Router();
const computePatientsDistanceToFacility = new ComputePatientsDistanceToFacilityService();
const normalizeData = new NormalizeDataService();
const computeScore = new ComputeScoreService();
const generateListOfPatients = new GenerateListOfPatientsService();

routes.get('/ping', (req, res) => res.send({ message: 'pong' }));

routes.get('/generate-list', (request, response) => {
  const { lat, long } = request.query;

  if (!lat || !long) {
    return response.status(404).json({ error: 'Cannot process invalid data' });
  }

  const facilityLocation = { latitude: Number(lat), longitude: Number(long) };

  const patientsWithDistance = computePatientsDistanceToFacility.execute(
    facilityLocation,
    patients,
  );

  const normalizedData = normalizeData.execute(patientsWithDistance);

  const patientsWithScore = computeScore.execute(normalizedData);

  const listOfPatients = generateListOfPatients.execute(patientsWithScore);

  return response.status(200).json(listOfPatients);
});

module.exports = routes;
