const express = require("express");
const patientRecommender = require("./patientRecommender");

const router = express.Router();
router.use("/patient", patientRecommender);

module.exports = router;
