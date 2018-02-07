import { forEach, flow, orderBy, reduce, take } from 'lodash/fp';
import { calculateScore } from '../helper/score';
import patients from '../sample-data/patients.json';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/weight-score/:lat/:long', (req, res) => {
  return getResult({ latitude: req.params.lat, longitude: req.params.long });
});

const getResult = (location) => {
  const data = [];
  forEach((value) => {
    data.push({
      id: value.id,
      name: value.name,
      score: calculateScore(location, value),
    });
  })(patients);
  const results = flow(
    orderBy((o) => o.score)('desc'),
    take(10))(data);

    const str = reduce.convert({cap: false})((result, value, index) => {
      return result += `${parseInt(index) + 1}. ${value.name} (${value.score}) \n`;
    })('')(results);
    console.log(str);
}

module.exports = { router, getResult };
