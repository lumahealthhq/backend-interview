const { Router } = require("express");

const PatientsRoutes = require("../routes/patients-routes");

module.exports = (app) => {
  const router = Router();

  app.use("/api", router);

  PatientsRoutes(router);
};
