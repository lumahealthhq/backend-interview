const express = require('express'),
  router = express.Router(); // eslint-disable-line new-cap
const multer = require('multer'),
  upload = multer({ dest: 'uploads/' });
const patientCtrl = require('../controllers/patient.controller');

router.route('/')
  /** GET /api/patients - Get list of patients */
  .get(patientCtrl.list)

  /** POST /api/patients - Create new patient */
  .post(patientCtrl.create);

router.route('/:patientId')
  /** GET /api/patients/:patientId - Get patient */
  .get(patientCtrl.get)

  /** PUT /api/patients/:patientId - Update patient */
  .put(patientCtrl.update)
  
  /** DELETE /api/patients/:patientId - Delete patient */
  .delete(patientCtrl.remove);

router.route('/upload')
  /** POST /api/patients/upload - upload patients */
  .post(upload.single('patients'), patientCtrl.upload);

router.route('/scored')
  /** POST /api/patients/upload - upload patients */
  .post(patientCtrl.scored);


router.route('/checkScores')
  /** POST /api/patients/upload - upload patients */
  .post(patientCtrl.checkScores);

/** Load patient when API with patientId route parameter is hit */
router.param('patientId', patientCtrl.load);

module.exports = router;
