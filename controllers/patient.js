

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

AppotinmentData.find().then(function (docs) {
    	docs.forEach( record =>{
    		if(record){
    		maxAge=record.maxAge;
			maxAcceptedOffers=record.maxAcceptedOffers;
			maxCanceledOffers=record.maxCanceledOffers;
			maxAverageReplyTime=record.maxAverageReplyTime;

    		}


    	});
       	
    }

	).catch();
 


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
function updateDataRange(maxAge,maxAcceptedOffers,maxCanceledOffers,maxAverageReplyTime){

		AppotinmentData.insertMany({ maxAge:maxAge,
			maxAcceptedOffers:maxAcceptedOffers,
			maxCanceledOffers:maxCanceledOffers,
			maxAverageReplyTime:maxAverageReplyTime
		}).then(function (docs) {
		    	docs.forEach(patient=>{
					setMinMax(patient);


		    	}); 
		}).catch(function (err) {
		    	console.log(err);
		        res.status(500).send(err);
		});


}


exports.setPatient = (req, res )=>{
		 
		const  patient = new Patient (req.body);
    	patient.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        	res.json({ data });
    	});		  

}



exports.getDistance = (req, res )=>{
		 	 
	let data 
	data = geolib.getDistance(
    		{ latitude: 51.5103, longitude: 7.49347 },
    		{ latitude: 51.5104, longitude: 7.49397 }
	);
    res.json({ data });    	  

}

function getPatients(){
		return  Patient.find().exec();
	
}

exports.getbestgradepatients = (req, res )=>{

	
		let coodenates= req.body;
		getPatients().then((patients) => {
   			res.json(gradeCalc(patients,coodenates));
  		});
				
}

function gradeCalc(patients, coodenates){
		let data=[];
		patients.forEach(patient=>{
				
					patient =normalizePacientData(patient,coodenates);

					let distance =	geolib.getDistance(
		    			{ latitude: coodenates.latitude, longitude: coodenates.longitude },
		    				{ latitude: patient.location.latitude, longitude: patient.location.longitude }
					);
					patient.distance =	(distance===0)? 1 : distance;
					let ageScore = (patient.age  -  minAge) /(maxAge-minAge) ;
					let distanceScore = 1-(patient.distance - minDistance)/ (maxDistance-minDistance) ;
					let canceledOffersScore =( (patient.canceledOffers - maxCanceledOffers)/(maxCanceledOffers-minCanceledOffers) )*(-3);
					let acceptedOffersScore =( ( patient.acceptedOffers - minAcceptedOffers  ) /(maxAcceptedOffers-minAcceptedOffers))*3 ;
					let averageReplyTimeScore =( ( maxAverageReplyTime  - patient.averageReplyTime  ) /(maxAverageReplyTime -minAverageReplyTime ))*2 ;
					console.log(patient);
					console.log("ageScore"+ageScore);
					console.log("distanceScore"+distanceScore);
					console.log("canceledOffersScore "+canceledOffersScore );
					console.log("acceptedOffersScore "+acceptedOffersScore );
					console.log("averageReplyTimeScore"+averageReplyTimeScore);
				
					//aux =JSON.stringify(patient);
					showUpGrade= averageReplyTimeScore+acceptedOffersScore+canceledOffersScore+distanceScore+ageScore;
					let aux ={
						id: patient.id,
						name: patient.name,
						grade: showUpGrade
					};
					console.log(aux);
					patient.showUpGrade= averageReplyTimeScore+acceptedOffersScore+canceledOffersScore+distanceScore+ageScore;
					const grade = averageReplyTimeScore+acceptedOffersScore+canceledOffersScore+distanceScore+ageScore;
					data.push(aux);
			});
			//console.log(data);
			data.sort((a, b) => (a.grade < b.grade) ? 1 : -1);
			console.log("max"+maxAverageReplyTime );
			console.log("max"+maxCanceledOffers);
			console.log("max"+maxAge);
		
			
			return data.slice(0,10);
}
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

console.log(normalizedPacientData);
return  normalizedPacientData;
}





exports.getbestgrade = (req, res )=>{

	
			let coodenates= req.body;
			//patients= Patient.find().exec();

			//console.log(patients);
			patients=[{"id":"a0ec56a4-0713-4a46-9a82-3ac9a8ced1f1","name":"Howard Reilly","location":{"latitude":"-81.9362","longitude":"-84.7416"},"age":56,"acceptedOffers":77,"canceledOffers":66,"averageReplyTime":1990},{"id":"60d8b1c8-a572-4ae2-ad16-80371ab56422","name":"Cyril Wiegand","location":{"latitude":"-68.1111","longitude":"83.2264"},"age":51,"acceptedOffers":1,"canceledOffers":25,"averageReplyTime":2609},{"id":"3ca34adc-78b1-4777-ab54-032803c070a9","name":"Kristoffer Abshire","location":{"latitude":"63.5570","longitude":"-14.2072"},"age":73,"acceptedOffers":61,"canceledOffers":86,"averageReplyTime":2950},{"id":"ab5a2aaf-8035-4282-a2b5-f8756b6976ce","name":"Liana Jacobson MD","location":{"latitude":"47.0372","longitude":"1.1852"},"age":74,"acceptedOffers":65,"canceledOffers":81,"averageReplyTime":2850},{"id":"96b5c525-adb8-4f6e-a2cc-a919a5be8cf8","name":"Mr. Toy Towne","location":{"latitude":"-62.3668","longitude":"10.7744"},"age":71,"acceptedOffers":35,"canceledOffers":26,"averageReplyTime":342},{"id":"fc5be993-6dc8-4b80-bf66-d035ab204727","name":"Araceli Zieme","location":{"latitude":"33.9846","longitude":"-161.0386"},"age":35,"acceptedOffers":66,"canceledOffers":94,"averageReplyTime":2616},{"id":"80775869-3356-47ed-8e65-f21cb70f525f","name":"Nova Medhurst","location":{"latitude":"57.4067","longitude":"86.9372"},"age":46,"acceptedOffers":94,"canceledOffers":36,"averageReplyTime":1869},{"id":"114530db-21f4-4fd9-be18-1e424a7fa543","name":"Francesca Hagenes","location":{"latitude":"-14.5366","longitude":"-91.8097"},"age":22,"acceptedOffers":46,"canceledOffers":35,"averageReplyTime":2525},{"id":"69b223d1-a59a-414c-8b33-e222e8ce0a46","name":"Maegan Fisher","location":{"latitude":"-64.2415","longitude":"-101.1892"},"age":63,"acceptedOffers":44,"canceledOffers":94,"averageReplyTime":1584},{"id":"ed3a7f40-745a-4d87-94c9-b348acc3e13f","name":"Brendon Collins","location":{"latitude":"-72.4695","longitude":"-176.4298"},"age":58,"acceptedOffers":2,"canceledOffers":100,"averageReplyTime":2843}];			 
			patients.forEach(patient=>{
					patient.distance =	geolib.getDistance(
		    			{ latitude: coodenates.latitude, longitude: coodenates.longitude },
		    			{ latitude: patient.location.latitude, longitude: patient.location.longitude }
					);
					let ageScore = (patient.age  -  minAge) /(maxAge-minAge) ;
					let distanceScore = (patient.distance - minDistance)/ (maxDistance-minDistance) ;
					let canceledOffersScore =( (patient.canceledOffers - maxCanceledOffers)/(maxCanceledOffers-minCanceledOffers) )*(-3);
					let acceptedOffersScore =( ( patient.acceptedOffers - minAcceptedOffers  ) /(maxAcceptedOffers-minAcceptedOffers))*3 ;
					let averageReplyTimeScore =( ( maxAverageReplyTime  - patient.acceptedOffers  ) /(maxAverageReplyTime -minAverageReplyTime ))*2 ;
					//console.log(patient);
					//console.log("ageScore"+ageScore);
					//console.log("distanceScore"+distanceScore);
					//console.log("canceledOffersScore "+canceledOffersScore );
					//console.log("acceptedOffersScore "+acceptedOffersScore );
					//console.log("averageReplyTimeScore"+averageReplyTimeScore);
					patient.showUpGrade= averageReplyTimeScore+acceptedOffersScore+canceledOffersScore+distanceScore+ageScore;
					const grade = averageReplyTimeScore+acceptedOffersScore+canceledOffersScore+distanceScore+ageScore;
					
			});
			data =patients;
			data.sort((a, b) => (a.showUpGrade < b.showUpGrade) ? 1 : -1);
		
			
			res.json({ data });

		
}
