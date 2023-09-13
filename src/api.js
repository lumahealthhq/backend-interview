// const express = require('express');



// const app = express();
// const port = 3000;


// app.get('/patients', (req, res) => {

//   const patients = data.getPatients();

//   const scoredPatients = patients.map(patient => ({
//     ...patient,
//     score: scoring.computePatientScore(patient),
//   }));

//   scoredPatients.sort((a,b) => b.score - a.score);

//   const topTenPatients = scoredPatients.slice(0, 10);
//   res.json(topTenPatients);
// });