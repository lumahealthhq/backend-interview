"use strict";
const express = require("express");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const { generatePatientList } = require("./lib/patient-ranking");

const PORT = process.env.PORT || 3000;
const HOST = "localhost";

const app = express();

app.get("/v1/generate-patients-list", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  if (!lat || isNaN(lat) || lat < -90.0 || lat > 90.0) {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request",
      message: "Invalid lat query parameter",
    });
  }

  if (!lon || isNaN(lon) || lon < -180.0 || lon > 180.0) {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request",
      message: "Invalid lon query parameter",
    });
  }

  const facilityLocation = {
    latitude: lat,
    longitude: lon,
  };

  try {
    const patients = await readFile("./sample-data/patients.json", "utf8");
    const patientsJson = JSON.parse(patients);
    const patientsList = generatePatientList(patientsJson, facilityLocation);
    return res.json(patientsList);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      statusCode: 500,
      error: "internal Server Error",
      message:
        "Something went wrong. Please try again later or contact customer support.",
    });
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
