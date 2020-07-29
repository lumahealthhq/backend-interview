const Patient  = require('../models/patient');
const AppotinmentData = require('../models/appointment_data');
const geolib = require('geolib');
let minAge=0;
let maxAge=1;
let minDistance =1;
let maxDistance =999999999;
let minAcceptedOffers  =0;
let maxAcceptedOffers  = 1;
let minCanceledOffers =0 ;
let maxCanceledOffers =1;
let minAverageReplyTime  =0;
let maxAverageReplyTime  =1;
let patients;

//retrieve maximum ranges from database and update them if a document is found on mongodb
//
AppotinmentData.find().sort({x:-1}).then( function (docs) {
    docs.forEach( record =>{
    	if(record){
			maxAge=record.maxAge;
			maxAcceptedOffers=record.maxAcceptedOffers;
			maxCanceledOffers=record.maxCanceledOffers;
			maxAverageReplyTime=record.maxAverageReplyTime;
    	}
    });
}).
catch(function (err) {
	console.log(err);
});


//function to compare maximum ranges with patient data, if patient data is out of the range, range is updated
setMinMax = (patient )=>{
	if(patient.age > maxAge ){
		maxAge =patient.age;
	}
	if(patient.acceptedOffers > maxAcceptedOffers  ){
		maxAcceptedOffers  =patient.acceptedOffers;
	}
	if(patient.canceledOffers > maxCanceledOffers){
		maxCanceledOffers =patient.canceledOffers;
	}
	if(patient.averageReplyTime > maxAverageReplyTime ){
		maxAverageReplyTime =patient.averageReplyTime;
	}
}

//set array of patients
exports.setPatients = (req, res )=>{
	Patient.insertMany(req.body)
	.then(function (docs) {
		docs.forEach(patient=>{
			setMinMax(patient);
		})
		updateDataRange(maxAge,maxAcceptedOffers,maxCanceledOffers,maxAverageReplyTime);
		res.json({ docs});
	})
	.catch(function (err) {
		console.log(err);
		res.status(500).send(err);
	});
}

//function to change the maximum range of the variables that are used to calculate the score
function updateDataRange(maxAge,maxAcceptedOffers,maxCanceledOffers,maxAverageReplyTime){
		AppotinmentData.insertMany({ 
			maxAge:maxAge,
			maxAcceptedOffers:maxAcceptedOffers,
			maxCanceledOffers:maxCanceledOffers,
			maxAverageReplyTime:maxAverageReplyTime
		}).
		then(function (docs) {
		    	docs.forEach(patient=>{
					setMinMax(patient);
		    	}); 
		}).
		catch(function (err) {
		    	console.log(err);
		        res.status(500).send(err);
		});
}

// retrieve patients list from database
function getPatients(){
		return  Patient.find().exec();
	
}

// function that receive coordenates and return patients with 10 best scores
exports.getbestgradepatients = (req, res )=>{
		let coodenates= req.body;
		getPatients().then((patients) => {
   				res.json(scoreCalc(patients,coodenates));
  		}).catch(function (err) {
				console.log(err);
				res.status(500).send(err);
	});
}

//function that calculate patient attendance score
function scoreCalc(patients, coodenates){
	let data=[];
	patients.forEach(patient=>{
		patient =normalizePacientData(patient,coodenates);
		let distance =	geolib.getDistance(
		    { latitude: coodenates.latitude, longitude: coodenates.longitude },
		    { latitude: patient.location.latitude, longitude: patient.location.longitude }
		);
			patient.distance =	(distance===0)? 1 : distance; //avoid 0 division
			patient.distance =	(distance>maxDistance)? maxDistance : distance;// avoiding negative results on distanteScore
			let ageScore = (patient.age  -  minAge) /(maxAge-minAge) ;
			let distanceScore = 1-(patient.distance - minDistance)/ (maxDistance-minDistance) ;
			let canceledOffersScore =( (patient.canceledOffers - maxCanceledOffers)/(maxCanceledOffers-minCanceledOffers) )*(-3);
			let acceptedOffersScore =( ( patient.acceptedOffers - minAcceptedOffers  ) /(maxAcceptedOffers-minAcceptedOffers))*3 ;
			let averageReplyTimeScore =( ( maxAverageReplyTime  - patient.averageReplyTime  ) /(maxAverageReplyTime -minAverageReplyTime ))*2 ;
			let attendanceScore= averageReplyTimeScore+acceptedOffersScore+canceledOffersScore+distanceScore+ageScore;
			let patientScore ={
				id: patient.id,
				name: patient.name,
				attendanceScore: attendanceScore
			};
			data.push(patientScore);
	});
	data.sort((a, b) => (a.grade < b.grade) ? 1 : -1);
	return data.slice(0,10);
}

//patients with missing data receive that tha will increase their score , therefore they will have a chance
function normalizePacientData(pacient,hospitalCoordenates){
		let normalizedPacientData={
				id:pacient.id,
				name:pacient.name,
				age:(pacient.age)?pacient.age : maxAge,
				acceptedOffers:(pacient.acceptedOffers)?pacient.acceptedOffers : maxAcceptedOffers,
				canceledOffers:(pacient.canceledOffers)?pacient.canceledOffers : minCanceledOffers,
				averageReplyTime:(pacient.averageReplyTime)?pacient.averageReplyTime : minAverageReplyTime,
				location:{
					latitude:(pacient.location)?pacient.location.latitude : hospitalCoordenates.latitude,
					longitude:(pacient.location)?pacient.location.longitude : hospitalCoordenates.longitude
				}
		};
		return  normalizedPacientData;
}



