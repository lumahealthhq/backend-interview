
const Score = require("patientscore");
const fs = require('fs');
let data =fs.readFileSync('patients.json');
const  coordenates={ latitude: 1.5104, longitude: 17.49397 };


Score.setPatients(JSON.parse(data)).then( (data) =>{
	Score.getpatients(coordenates);

});


