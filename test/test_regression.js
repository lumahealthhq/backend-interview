/*
 * This version of the program sets up a test list, in addition to the training list, and calculates the coefficient
 * of determination.  This allows us to evaulate how well our model fits the provided data.  This is a standard node.js
 * program: node test_regression.js
 */

const PATIENTS = require('../data/patients.json');
require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const LinearRegression = require('../js/linear-regression.js');

let regression;
let min = 9999;
let max = 0;
let count = 0;
const MIN_OFFERS_NEEDED = 20;
const TEST_SET_FREQUENCY = 25; //1 in TEST_SET_FREQUENCY patients is used for the test set data

let patientsWithInsufficientData = [];
let trainingSet = [];
let testSet = [];
let arrayTrainingFeatures = [];
let arrayTrainingLabels = [];
let arrayTestFeatures = [];
let arrayTestLabels = [];

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

function setupListsForTest(lat, lon) {
    //sort patients into those with insufficient data (for special handling), the training set, and the test set.
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
            if (i % TEST_SET_FREQUENCY) {
                trainingSet.push(patient);
            }
            else {
                testSet.push(patient);
            }
        }
    });

    //we now need to condition these into arrays of arrays, and then into tensors
    trainingSet.forEach(patient => {
        arrayTrainingFeatures.push([patient.distance, patient.age, patient.averageReplyTime, patient.acceptedOffers, patient.canceledOffers]);
        arrayTrainingLabels.push([patient.acceptProb]);
    });

    testSet.forEach(patient => {
        arrayTestFeatures.push([patient.distance, patient.age, patient.averageReplyTime, patient.acceptedOffers, patient.canceledOffers]);
        arrayTestLabels.push([patient.acceptProb]);
    });
}

function setupLists(lat, lon) {
    //sort patients into those with insufficient data (for special handling), the training set, and the test set.
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

    //we now need to condition these into arrays of arrays, which is what our LinearRegression constructor will be expecting
    trainingSet.forEach(patient => {
        arrayTrainingFeatures.push([patient.distance, patient.age, patient.averageReplyTime, patient.acceptedOffers, patient.canceledOffers]);
        arrayTrainingLabels.push([patient.acceptProb]);
    });
}


function buildModelAndMakePredictions(lat, lon) {
    regression.train();
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
//    console.log('maxPrediction: ', maxPrediction, 'minPrediction: ', minPrediction);
    PATIENTS.forEach(patient => {
        //normalize the predicted values to a 0 to 1 range for ease of handling
        patient.prediction = (patient.prediction - minPrediction)/(maxPrediction - minPrediction);
    });
}

function getMostLikelyPatients(lat, lon, numberToGet = 10) {
    let topTenList = [];
    setupListsForTest(lat, lon);
    regression = new LinearRegression(arrayTrainingFeatures, arrayTrainingLabels, {
        learningRate: 0.01,
        maxIterations: 500,
        weights: [0.1, 0.1, 0.2, 0.3, 0.3]
    });
    buildModelAndMakePredictions(37.7749, 122.4194);
    PATIENTS.sort((a, b) => a.prediction > b.prediction ? -1 : 1)

    if (patientsWithInsufficientData.length) {
numberToGet = 9;
//pick at random a patient with insufficient data to top the list, so this patient gets data
topTenList.push(patientsWithInsufficientData[Math.floor(Math.random() * patientsWithInsufficientData.length)]);
topTenList[0].prediction = -0.1;    //set the prediciton to a negative value to indicate "no prediction value"
}
for (let i = 0; i < numberToGet; i++) {
    topTenList.push(PATIENTS[i]);
}

//we don't want to return all the data, just the id, name, and score
topTenList = topTenList.map(patient => {
    return {id: patient.id, name: patient.name, score: Math.ceil(patient.prediction * 10)};
});
return topTenList;
}

getMostLikelyPatients(37.7749,122.4194);
console.log('coefficient of determination (R^2):', regression.test(arrayTestFeatures, arrayTestLabels));
