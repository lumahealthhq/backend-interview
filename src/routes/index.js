const express = require('express');

const GenerateListController = require('../controllers/GenerateListController');

const generateListController = new GenerateListController();

const routes = express.Router();

routes.get('/ping', (req, res) => res.send({ message: 'pong' }));

routes.get('/generate-list', (request, response) => {
  const { lat, long } = request.query;

  if (!lat || !long) {
    return response.status(404).json({ error: 'Cannot process invalid data' });
  }

  const listOfPatients = generateListController.index({ lat, long });

  return response.status(200).json(listOfPatients);
});

module.exports = routes;
