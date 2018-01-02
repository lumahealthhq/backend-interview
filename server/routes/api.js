const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.use('/users', require('./user.route'));
router.use('/patients', require('../controllers/patients'));

module.exports = router;
