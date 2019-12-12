const { Router } = require('express');
const PatientController = require('../controllers/PatientController');

const patientRouter = new Router();

patientRouter.get('/patients/rank', PatientController.patientsRank);

module.exports = patientRouter;
