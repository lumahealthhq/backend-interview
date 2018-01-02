var router = require('express').Router();

const patients = require('./patients.json');

router.get('/', function(req, res, next) {
  res.status(200).json(patients);
});

module.exports = router;