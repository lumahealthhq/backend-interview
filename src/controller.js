const router = require('express').Router();
const service = require('./waitlist');

const sampleData = require('../sample-data/patients.json');

router.post('/v1/waitlist/suggestion', async (req, res) => {
  const { body } = req;
  const { dataset, facilityLat, facilityLng } = body;

  const suggestionList = await service.generateImprovedWaitlist(dataset, facilityLat, facilityLng);

  res.json(suggestionList);
});

router.get('/v1/waitlist/suggestion/from-sample', async (req, res) => {
  const suggestionList = await service.generateImprovedWaitlist(sampleData, 68.8129, 71.3018);

  res.json(suggestionList);
});

module.exports = router;
