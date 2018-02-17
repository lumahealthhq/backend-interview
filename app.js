/*
LUMA HEALTH INTERVIEW assignment
Author-Interviewee: Mustafa Bereket  <mbereke1@binghamton.edu>
*/


var express = require('express');         // Including necessary libraries
var bodyParser = require('body-parser');  // express, bodyParser (essentials..)
var faker = require('faker');             // Faker was already provided, I included here to handle everything in one single JS file
var app = express();

app.use(function (req, res, next) {                     //Configuring the API
    res.setHeader('Access-Control-Allow-Origin', '*');  //to make it work universally in any environment without getting CORSE error
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use( bodyParser.json() );                     //Configuring BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.get('/',function (req,res){                   // Leaving a small console note..
    res.send('Please go to main folder and run index.html to get started..');
})
app.post('/run',function (req,res){               // Our Main API call where everything starts

    var generatedPatients = createPatients(req.body.patNum);    // Generates patients with the given number
    var resultList = calculateScore(generatedPatients,req.body.lat,req.body.long);
    /*
    This Function above
    - Calculates their scores and other stats and returns an Object which has all the essential data in it.
    - In addition to randomly generated patient data, it takes Latitude and Longitude to calculate the patients' distance to the Hospital
    */

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resultList));    //Return the result to the Client..

})

function createPatients(number){
/*
This is 'generate_data.js' provided
Just added here for convenience to return patients list
within the this one single JS file
*/
  var patients = [];
  var i = 0;

  while (i < number) {
  	i++;
  	patients.push({
  		id:  faker.random.uuid(),
  	    name: faker.name.findName(),
  	    location: {
  	    	latitude : faker.address.latitude(),
  	    	longitude : faker.address.longitude()
  	    },
  	    age : faker.random.number({min:21, max:90}),
  	    acceptedOffers : faker.random.number({min:0, max:100}),
  	    canceledOffers : faker.random.number({min:0, max:100}),
  	    averageReplyTime : faker.random.number({min:1, max:3600}),


  	});
  }

  return patients;
}



function calculateScore(patients,lat,long){
  /*
  Main purpose of this function is to generate a score for each patient representing a possibility of offer acception RATE
  it calculates the patients' distance to the Hospital based on given Lat and Long parameters.
  I apply the given percentages in the assignment for each attribute of generated patients
  - Do addition for Age and Accepted Offers
  - Do substraction for Cancelled Offers, Average Reply Time and Distance (as they are indication for negative possible results)
  - In addition to creating a score, I also calculate the average age, distantce To Hospital, accepted and cancelled offers
  As For Patients with "Little Data" should be randomly put on top of the list criteria:
  Since the definition of 'little' is a subject to interpretation
  I use following logic..
  - If a patient's total number of accepted and cancelled offer count is less than 15% of the average total accepted and Cancelled
  - I put them in a special array, and take 3 of those patients and place it on top in the main result listen
  - Please see detailed explanation of my logic in the README document.
  */

  var avgAge = 0;
  var avgAccepted = 0;
  var avgCancelled = 0;
  var exceptions = [];

  //var arr = [];
  for(var i=0; i < patients.length ; i++){
    var score = 0;                                      // Create a score attribute for each patient
    score += patients[i].age * 0.1;                    // Average weigh 10% in positive way
    score += patients[i].acceptedOffers * 0.3;         // Accepted offers weigh 30% in positive way
    score -= patients[i].canceledOffers * 0.3;         // Cancelled offers weigh 30% in negative way
    score -= (patients[i].averageReplyTime/60) * 0.2;  // Avg reply time weigh 20% in negative way
    score -= distance(lat,long,patients[i].location.latitude,patients[i].location.latitude,patients[i].location.longitude,"M") * 0.1; // Dist. to hospital weigh 10% in negative way

    patients[i].score = score.toFixed(2);
    patients[i].distanceToHospital = (distance(lat,long,patients[i].location.latitude,patients[i].location.latitude,patients[i].location.longitude,"M")).toFixed(0);
    avgAge += patients[i].age;
    avgAccepted += patients[i].acceptedOffers;
    avgCancelled += patients[i].canceledOffers;

  }

  if(patients){
    var obj = {                                           // Creating the main object which will be returned to user in the end
      avgAge: (avgAge / patients.length).toFixed(2),      // initializing the attributes gathered so far.
      avgAccepted: (avgAccepted / patients.length).toFixed(2),
      avgCancelled: (avgCancelled / patients.length).toFixed(2),
      patients: patients.sort(compare)              // Sorting main (whole) patients list based on their score biggest to smallest
    }
  }

  /*
    Once we have our scores generated and list sorted,
    Now time to look for exceptions
    Up to 3 Patients with little data should be selected and prioritized on top of the Stack
  */
  var patientsWLD = findPatientsWithLittleData(Number(obj.avgAccepted), Number(obj.avgCancelled), patients);   // Picks up to 3 patients with 85% less information than an average patient

  /*
  patientsWLD length is unknown, it can range from 0 to 3
  following piece of code takes the returned patientsWLD, takes it as top elements of the array
  and fills rest of the mainList with the patients with the best score
  */

  var mainList = patientsWLD;
  var count = 0;

  while(Object.keys(mainList).length<10){           //Filling the rest of the Main Result stack with patients with the best results.
    if(!mainList[patients[count].id]){              //Avoiding duplicates..
      mainList[patients[count].id] = patients[count];
      count++;
    }else{

      count++;
    }

  }
  obj.mainList = mainList;        // Tieing main result list to main response object
  console.log("MAIN LIST:",mainList);


  return obj;

}

function compare(a,b){    return b.score-a.score;}  // Sorting argument of all patients list based on their score
function distance(lat1, lon1, lat2, lon2, unit) {   // Distance Calculator with given Latitude and Longitute. (Google Search)
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

function findPatientsWithLittleData(avgAccepted,avgCancelled,patientsList){

  /*
  Finding Patients with little Data
  Whoever has 15% or less than the average data, they will be returned and placed on top of the main result stack
  */

    var list = {};

    for(var i=0; i<patientsList.length; i++){

      if(((avgAccepted+avgCancelled)*0.15) >= (patientsList[i].acceptedOffers+patientsList[i].canceledOffers)){
        patientsList[i].fromRandom = true;
        list[patientsList[i].id] = patientsList[i];
        if (Object.keys(list).length>=3){  return list;}
      }


    }

    return list;

}

app.listen(3000, function () {
    console.log("App is listening");
})
