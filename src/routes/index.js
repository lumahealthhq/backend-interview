const express = require('express');

const patients = require('../../patients.json');

const ComputePatientsDistanceToFacilityService = require('../services/ComputePatientsDistanceToFacilityService');
const NormalizeDataService = require('../services/NormalizeDataService');
const ComputeScoreService = require('../services/ComputeScoreService');

const routes = express.Router();
const computePatientsDistanceToFacility = new ComputePatientsDistanceToFacilityService();
const normalizeData = new NormalizeDataService();
const computeScore = new ComputeScoreService();

routes.get('/compute', (request, response) => {
  const { lat, long } = request.query;

  if (!lat || !long) return response.status(404).json({ error: 'deu ruim' });

  const facilityLocation = { latitude: Number(lat), longitude: Number(long) };

  const patientsWithDistance = computePatientsDistanceToFacility.execute(
    facilityLocation,
    patients,
  );

  const normalizedData = normalizeData.execute(patientsWithDistance);

  const patientsWithScore = computeScore.execute(normalizedData);

  return response.status(200).json(patientsWithScore);
});

module.exports = routes;
