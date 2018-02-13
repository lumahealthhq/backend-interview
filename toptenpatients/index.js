/**
 * Module for getting a list of top 10 patients having maximum chance to accept a call offer
 * @module toptenpatients
 */
var fs = require('fs');
var geolib = require('geolib');
var max = 0;
var min = 0;
var ageWeight = 0.1;
var distanceWeight = 0.1;
var acceptedOfferWeight = 0.3;
var cancelledOfferWeight = 0.3;
var repltyTimeWeight = 0.2;
/**
 * This function find a list of patients having maximum chance to accept a call offer
 * @param {String,Number,Number} input file name of historical data, longitude and latitude of the clinic
 * @returns {Promise} a Promise Object
 */
exports.getPatientList = function(filePath,latitude,longitude) {
return new Promise(function(resolve,reject) {
  var numberOfClients = 10;
  var userScore = new Array();
  var userNoBehave = new Array();
  var result = [];
  var obj = null;
  var data = null;
  if(isValidLocation(latitude,longitude)){ //validate latitude and longitude
    reject('Invalid latitude or longitude!')
  }
 data = readDataFile(filePath); // read historical data
 if(!data) //reject if data is not available
   reject('Patient file read failiure!')
  obj = parseData(data); // parse as json
 if(!obj) // reject if the data can't be parsed
  reject('Patient file parsing failiure!')

   for(var i=0; i<obj.length;i++){ //loop through the data
    var id = obj[i].id;
    var age = obj[i].age;
    var name = obj[i].name;
    var acceptedOffers = obj[i].acceptedOffers;
    var canceledOffers = obj[i].canceledOffers;
    var averageReplyTime = obj[i].averageReplyTime;
    var distanceFromClinic = getDistanceFromClinic(obj[i].location,{latitude,longitude});// gets the distance between clinic and patient
    if(canceledOffers <=30 && acceptedOffers <= 30){ //store patients with less behavioral data
    var user = getUser(id,name,0);
    userNoBehave.push(user);
  }else {// get users absolute score.
    var absoluteScore = getAbsoulteScore(age,distanceFromClinic,acceptedOffers,canceledOffers,averageReplyTime);
    var user = getUser(id,name,absoluteScore);
    updateMaxMinValue(user.absoluteScore);
    userScore.push(user);
   }
  }

  for(var i=0;i<userScore.length;i++){ //find normalized score of the patient ( 1 - 10) 10 being the highest
  var user = userScore[i];
  user.score = getNormalizedScore(max,min,user.absoluteScore);
  }

   var randomUser = getRandomUser(userNoBehave); // randomly select user with no much behavioral data
   if(randomUser){
     result.push(randomUser);
   }
   console.log(result);
   userScore.sort(numberSort);
   for(var i=result.length;i<numberOfClients && i<userScore.length;i++){ // prepare the final result
      result.push(userScore[i]);
    }
    resolve(result); // resolve the promise with data
});
}
/**
 * This function read patients.json file
 * @param {filePath} input file name
 * @returns {data} file data
 */
function readDataFile(filePath) {
  var data = null;
    try{
       data = fs.readFileSync(filePath, 'utf8');
     }
     catch(err) {
        return data;
     }
     return data;
}
/**
 * This function read patients.json file
 * @param {string} input file name
 * @returns {data} file data
 */
function getDistanceFromClinic(locationClinic,locationPatient) {
    return Number((geolib.getDistance(locationClinic,locationPatient) * 0.000621371).toFixed(0));
}
/**
 * This function read patients.json file
 * @param {daat} input file containts
 * @returns {JSON} JSON data
 */
function parseData(data) {
  var obj = null;
    try{
        obj = JSON.parse(data);
    }catch(err){
      return obj;
    }
return obj;
}

/**
 * This function update max and min absolute score
 * @param {Number} input absolute score of Patient
 * @returns {} no
 */
function updateMaxMinValue(absoluteScore){
  if(max < Number(absoluteScore))
  max = Number(absoluteScore);
  if(min > Number(absoluteScore))
  min = Number(absoluteScore);
}
/**
 * This function calculates score of a patient from absolute score
 * @param {Number,Number,Number} input min absolute score,max absolute score, absolute score of Patient
 * @returns {Number} relative score (1 - 10) of the Patient
 */
function getNormalizedScore(max,min,absoluteScore) {
  return Number(1 + (absoluteScore - min ) * (9/(max-min))).toFixed(0);
}
/**
 * This function find random patient from a list of patients with less behabioural data
 * @param {list} list of patients
 * @returns {Object} a patient
 */
function getRandomUser(userWithNoBehave) {
  if(userWithNoBehave.length > 0){
    return userWithNoBehave[Math.floor(Math.random()*userWithNoBehave.length)];
  }
 return null;
}

/**
 * This function validate latitude and longitude
 * @param {Number,Number} input latitude and longitude
 * @returns {boolean} valid or Invalid
 */
function isValidLocation(latitude,longitude){
    if(!latitude || !longitude) return false;
}

/**
 * This function calculates absolute score
 * @param {Number,Number,Number,Number,Number} input age , distance of the patient from clinic, accepted Offers, canceled Offers, average reply time
 * @returns {Number} absolute score
 */
function getAbsoulteScore(age,distanceFromClinic,acceptedOffers,canceledOffers,averageReplyTime){
  var absoluteScore  = Number(age * ageWeight + distanceFromClinic * distanceWeight + acceptedOffers * acceptedOfferWeight +
  canceledOffers * cancelledOfferWeight + averageReplyTime * repltyTimeWeight);
  return absoluteScore;
}

/**
 * This function makes a user
 * @param {String,String,Number} input id name and absolute score of a patient
 * @returns {Object} a user
 */
function getUser(id,name,absoluteScore){
  user = new Object();
  user.id = id;
  user.name = name;
  if(absoluteScore != 0)
  user.absoluteScore = absoluteScore;
  return user;
}
/**
 * This function works as a comparator for sorting users based on score in decreasing order
 * @param {Object,Object} input User,User
 * @returns {Number} difference between user absoulte scores
 */
function numberSort(a,b) {
   var score1 = a.absoluteScore;
   var score2 = b.absoluteScore;
   return score2 - score1;
}

exports.isValidLocation = isValidLocation;
exports.readDataFile = readDataFile;
exports.getDistanceFromClinic = readDataFile;
exports.parseData = parseData;
exports.getNormalizedScore = getNormalizedScore;
exports.getAbsoulteScore = getAbsoulteScore;
