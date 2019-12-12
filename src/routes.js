const { Router } = require('express');
const patientRouter = require('./app/routers/patientRouter');

const routes = new Router();

routes.use(patientRouter);

module.exports = routes;
