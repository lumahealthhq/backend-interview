const express = require('express');
const Promise = require('bluebird');
const generateCallList = require('./generateCallList.js').generateCallList;

const app = express();

app.get('/callList', (req, res) => {
  generateCallList(req.query.facilityLat, req.query.facilityLong, req.query.filePath)
  .then((patientList) => {
    res.json(patientList)
  });
});

module.exports = app;