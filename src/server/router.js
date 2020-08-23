const express = require("express");
const patientRecommender = require("./patientRecommender");

// Router for patient related manipulations.
const router = express.Router();
router.use("/patient", patientRecommender);

module.exports = router;
