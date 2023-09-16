import express, { static as expressStatic } from 'express';
import path from 'path';
const app = express();
const port = 3000;
import { computePatientScore } from './src/scoring.js';
import { getPatients } from './src/data.js';

const __dirname = path.resolve();

app.use(expressStatic(__dirname));


app.get('/patients', (req, res) => {
  const patients = getPatients();

  const scoredPatients = patients.map(patient => ({
    ...patient,
    score: computePatientScore(patient),
  }));

  scoredPatients.sort((a,b) => b.score - a.score);

  const topTenPatients = scoredPatients.slice(0, 10);
  res.json(topTenPatients);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
