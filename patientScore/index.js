const Patient  = require('./models/patient');
const AppointmentData = require('./models/appointment_data');
const geolib = require('geolib');
let minAge=0;
let maxAge=100;
let minDistance =1;
let maxDistance =999999999;
let minAcceptedOffers  =0;
let maxAcceptedOffers  = 1;
let minCanceledOffers =0 ;
let maxCanceledOffers =1;
let minAverageReplyTime  =0;
let maxAverageReplyTime  =1;
let patients;
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose
    .connect("mongodb://localhost/luma", {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'));

//retrieve maximum ranges from database and update them if a document is found on mongodb
//
AppointmentData.find().sort({x:-1}).then( function (docs) {
	if(docs[0]){
			let record =docs[0];
 		    maxAge=record.maxAge;
			maxAcceptedOffers=record.maxAcceptedOffers;
			maxCanceledOffers=record.maxCanceledOffers;
			maxAverageReplyTime=record.maxAverageReplyTime;
	}		//console.log(record);
}).
catch(function (err) {
	console.log(err);
});

//function to compare maximum ranges with patient data, if patient data is out of the range, range is updated
setMinMax = (patient )=>{
	console.log("max changed");
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
			console.log("max"+maxAverageReplyTime );
			console.log("max"+maxCanceledOffers);
			console.log("max"+maxAge);
}

//set array of patients
exports.setPatients = (patients)=>{
	return Patient.insertMany(patients)
	.then(function (docs) {
		docs.forEach(patient=>{
			setMinMax(patient);
		})
		updateDataRange(maxAge,maxAcceptedOffers,maxCanceledOffers,maxAverageReplyTime);
		
	})
	.catch(function (err) {
		console.log(err);
		
	});
}

//function to change the maximum range of the variables that are used to calculate the score
function updateDataRange(maxAge,maxAcceptedOffers,maxCanceledOffers,maxAverageReplyTime){
	AppointmentData.insertMany({ 
		maxAge:maxAge,
		maxAcceptedOffers:maxAcceptedOffers,
		maxCanceledOffers:maxCanceledOffers,
		maxAverageReplyTime:maxAverageReplyTime
	}).then(function (docs) {
		docs.forEach(patient=>{
			setMinMax(patient);
		}); 
	}).catch(function (err) {
		console.log(err);
		
	});
}

// retrieve patients list from database
function getPatientsFromDatabase(){
	return  Patient.find().exec();
	
}

// function that receive coordenates and return patients with 10 best scores
exports.getpatients = (coordenates)=>{
	
	getPatientsFromDatabase().then((patients) => {
		patients.forEach(patient=>{
			setMinMax(patient);
		})
		updateDataRange(maxAge,maxAcceptedOffers,maxCanceledOffers,maxAverageReplyTime);
		console.log(scoreCalc(patients,coordenates));
   		return scoreCalc(patients,coordenates);
  	}).catch(function (err) {
		console.log(err);
		return err;
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
			//console.log(patient);
			//console.log("ageScore"+ageScore);
			//console.log("distanceScore"+distanceScore);
			//console.log("canceledOffersScore "+canceledOffersScore );
			//console.log("acceptedOffersScore "+acceptedOffersScore );
			//console.log("max"+maxAverageReplyTime );
			//console.log("max"+maxCanceledOffers);
			//console.log("max"+maxAge);
					//console.log("averageReplyTimeScore"+averageReplyTimeScore);

	});
	data.sort((a, b) => (a.attendanceScore< b.attendanceScore) ? 1 : -1);
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



