/*
 * The exported function is: getMostLikelyPatients(lat, lon, numberToGet = 10)
 *
 * lat - the latitude of the office<br>
 * lon - the longitude of the office<br>
 * numberToGet - the number of patients to return on the list. default=10, range 1..100
 *
 * returns - an array of the most likely patients to accept the new appontment offer.  If there are patients
 * with insufficient data, one of these is selected at random and put at the top of the list.
 *
 * If there is any problem, an empty array is returned.  The id, name, and score (1 to 10) is returned for each
 * patient.  (If the patient has insufficient data, then the score for that patient is -1.)
 */

const PATIENTS = require('../data/patients.json');
const LinearRegression = require('./linear-regression.js');

let regression;
let min = 9999;
let max = 0;
let count = 0;
const MIN_OFFERS_NEEDED = 20;   //threshold for sufficient data to be included in the candidate set; if under threshold, handle separately

let patientsWithInsufficientData = [];
let trainingSet = [];
let arrayTrainingFeatures = [];
let arrayTrainingLabels = [];

// Convert Degress to Radians
function deg2Rad( deg ) {
    return deg * Math.PI / 180;
}

//calculate distance using pythagoras
//NOTE: Technically, since distances on earth are spherical and not planar, it should be a haversine function (per spherical trigonometry).
//      In practice, within a city (e.g. San Francisco) the distances are too small to create enough deviation for there to be a meaningful difference.
//      In addition, we do not really care about the distance units, as we are just trying to get a relative order that is in scale.
function calculateDistance(lat1, lon1, lat2, lon2) {
    lat1 = deg2Rad(lat1);
    lat2 = deg2Rad(lat2);
    lon1 = deg2Rad(lon1);
    lon2 = deg2Rad(lon2);
    let x = (lon2-lon1);
    let y = (lat2-lat1);
    return Math.sqrt(x*x + y*y);
}

function setupLists(lat, lon) {
    //sort patients into those with insufficient data (for special handling), and the training set.  Calcualte distances.
    PATIENTS.forEach((patient, i) => {
        patient.distance = calculateDistance(lat, lon, patient.location.latitude, patient.location.longitude);

        const offerCount = patient.acceptedOffers + patient.canceledOffers;
        if (offerCount > 0) {
            patient.acceptProb = patient.acceptedOffers/offerCount;
        }
        if (offerCount < MIN_OFFERS_NEEDED) {
            patientsWithInsufficientData.push(patient);
        }
        else {
            //use all the data as training set, which should yield the most accurate results.  If performance becomes a
            //concern, then use a smaller training set, incorporate BGD or SGD descent, or exit training when increments
            //become smaller than a threshold value.
            trainingSet.push(patient);
        }
    });

    //we now need to condition these into arrays of arrays, including only the desired fields, which is what our LinearRegression constructor is expecting
    trainingSet.forEach(patient => {
        arrayTrainingFeatures.push([patient.distance, patient.age, patient.averageReplyTime, patient.acceptedOffers, patient.canceledOffers]);
        arrayTrainingLabels.push([patient.acceptProb]);
    });
}


function buildModelAndMakePredictions(lat, lon) {
    //call the train method to build the model
    regression.train();

    //make
    let maxPrediction = 0;
    let minPrediction = 99;
    PATIENTS.forEach(patient => {
        patient.prediction = regression.predict([
            [
                patient.distance,
                patient.age,
                patient.averageReplyTime,
                patient.acceptedOffers,
                patient.canceledOffers
            ]
        ]);
        if (patient.prediction > maxPrediction) {
            maxPrediction = patient.prediction;
        }
        if(patient.prediction < minPrediction) {
            minPrediction = patient.prediction;
        }
    });

    //normalize the predicted values to a 0 to 1 range for ease of handling
    PATIENTS.forEach(patient => {
       patient.prediction = (patient.prediction - minPrediction)/(maxPrediction - minPrediction);
    });
}

function getMostLikelyPatients(lat, lon, numberToGet = 10) {
    let topTenList = [];

    //let's validate our parameters
    if (numberToGet < 1 || numberToGet > 100) {
        return topTenList;  //return the empty list
    }
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
        //latitude or longitude are out of range
        return topTenList;  //return empty list
    }

    //set up the required lists (training features, training labels, patients with insufficient data)
    setupLists(lat, lon);

    //create the regression object instance from the class, including supplying the weights specified in the problem definition
    regression = new LinearRegression(arrayTrainingFeatures, arrayTrainingLabels, {
        learningRate: 0.01,
        maxIterations: 500,
        weights: [0.1, 0.1, 0.2, 0.3, 0.3]
    });

    //train the linear regression model and make predictions for each patient.  Sort these ordered by "most likely" prediction first.
    buildModelAndMakePredictions(37.7749, 122.4194);
    PATIENTS.sort((a, b) => a.prediction > b.prediction ? -1 : 1)

    if (patientsWithInsufficientData.length) {
        numberToGet = numberToGet - 1;
        //pick at random a patient with insufficient data to top the list, so this patient gets data, convert prediciton to returned 1 to 10 scale
        topTenList.push(patientsWithInsufficientData[Math.floor(Math.random() * patientsWithInsufficientData.length)]);
        topTenList[0].prediction = -0.1;    //set the prediciton to a negative value to indicate "no prediction value"
    }

    //assemble the topTenList, convert precdiction to returned 1 to 10 scale, as specified in the problem definition
    topTenList = topTenList.concat(PATIENTS.slice(0, numberToGet)).map(patient => {
        return {id: patient.id, name: patient.name, score: Math.ceil(patient.prediction * 10)};
    });
    return topTenList;
}

module.exports = getMostLikelyPatients;