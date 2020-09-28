const express = require('express');

const GenerateListController = require('../controllers/GenerateListController');

const generateListController = new GenerateListController();

const routes = express.Router();

routes.get('/ping', (req, res) => res.send({ message: 'pong' }));

// This route is responsible for generating the sorted list of patients
routes.get('/generate-list', (request, response) => {
  const { lat, long } = request.query;

  if (!lat || !long) {
    return response.status(404).json({ error: 'Cannot process invalid data' });
  }

  try {
    const listOfPatients = generateListController.index({ lat, long });

    return response.status(200).json(listOfPatients);
  } catch (err) {
    console.error(err);
    return response
      .status(500)
      .json({ error: 'An error has occurred, please try again later.' });
  }
});

module.exports = routes;
