const fs = require('fs'),
  lumaPriority = require('../../lib/index');

var patients = [];

/*
 * Patient:
 *   {
    "id": "541d25c9-9500-4265-8967-240f44ecf723",
    "name": "Samir Pacocha",
    "location": {
      "latitude": "46.7110",
      "longitude": "-63.1150"
    },
    "age": 46,
    "acceptedOffers": 49,
    "canceledOffers": 92,
    "averageReplyTime": 2598
  } 
 */


/**
 * Load patient and append to req.
 */
exports.load = function(req, res, next, id) {
  req.patient = patients.find(u => u.id == id);
  return next();
}

exports.create = function(req, res) {
  const patient = { 
    id: req.body.id, 
    name: req.body.name,
    location: req.body.location,
    age: req.body.age,
    acceptedOffers: req.body.acceptedOffers,
    canceledOffers: req.body.canceledOffers,
    averageReplyTime: req.body.averageReplyTime 
  };
  patients.push(patient);
  res.status(200).json(patient);
}

exports.update = function(req, res) {
  req.patient.name = req.body.name;
  res.status(200).json(req.patient);
}

exports.remove = function(req, res) {
  patients = patients.filter(u => u !== req.patient);
  res.status(200).json(req.patient);  
}

/**
 { fieldname: 'patients',
  originalname: 'patients.json',
  encoding: '7bit',
  mimetype: 'application/json',
  destination: 'uploads/',
  filename: '713a9ce0cc9127e63470aa30504e7285',
  path: 'uploads/713a9ce0cc9127e63470aa30504e7285',
  size: 4018 }
 */
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.upload = function(req, res, next) {
  if (req.file) {
    try {
      patients = JSON.parse(fs.readFileSync(req.file.path));
    } catch ( err ) {
      // handle your file not found (or other error) here
    }

    return res.end('Thank you for the file');
  }

  res.end('Missing file');
}

/**
 * Get patient
 * @returns {Patient}
 */
exports.get = function(req, res) {
  res.status(200).json(req.patient);
}

/**
 * Get patient list.
 * @property {number} req.query.skip - Number of patients to be skipped.
 * @property {number} req.query.limit - Limit number of patients to be returned.
 * @returns {Patient[]}
 */
exports.list = function(req, res) {
  res.status(200).json(patients);
}

exports.scored = function(req, res) {
  if (req.query) {
    var { limit, lowData } = req.query;
    if (limit) {
      limit = parseInt(limit);
    } else {
      limit = 10;
    }

    if (lowData) {
      lowData = parseInt(lowData);
    } else {
      lowData = 3;
    }
  }

  if (req.body.latitude && req.body.longitude) {
    const facilityLocation = {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }

    var patientCategories = lumaPriority.filterPatients(patients, facilityLocation);
    var lowHistoricalDataPatients = patientCategories.lowDataPatients.slice(0, lowData);
    var topPatients = patientCategories.sortedPatients.slice(0, limit - lowHistoricalDataPatients.length);
    var result = lowHistoricalDataPatients.concat(topPatients);

    return res.status(200).json(result);
  }
  
  res.status(400).send('Need facility location!');
}


exports.checkScores = function(req, res) {
  const scoreSet = {
    facilityLocation: req.body.facilityLocation,
    patients: req.body.patients,
    scores: []
  }

  scoreSet.patients.forEach(p => {
    scoreSet.scores.push(lumaPriority.scorePatient(p, scoreSet.facilityLocation));
  });
  
  return res.status(200).json(scoreSet);
}
