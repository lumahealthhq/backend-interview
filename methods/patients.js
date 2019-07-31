const patientsList = require('../data/patients.json');
const geolib = require('geolib');
const {getRegression} = require('../data/linearRegression');

/**
 * Endpoint handler that run predictions on all patients on dataset and return 10 patients
 * if there is any patient with little behavior data, the first patient will be a little behavior data patient
 * else all patients are well scored patients with sufficient data
 * @param req
 * @param res
 * @returns {patients[]}
 */
let getListOfScoredPatients = (req, res) => {
    let {lat, lon, amount = 10} = req.query;

    let maxPrediction = 0;
    let minPrediction = 99;
    let scoredPatientsList = [];
    let patientsLittleBehaviorData = [];


    patientsList.forEach(patient => {

        patient.distance = geolib.getDistance({latitude: lat, longitude: lon}, {
            latitude: patient.location.latitude,
            longitude: patient.location.longitude
        });

        const offerCount = patient.acceptedOffers + patient.canceledOffers;

        if (offerCount > 0) {
            patient.acceptProb = patient.acceptedOffers / offerCount;
        }

        if (offerCount < 5) {
            patientsLittleBehaviorData.push(patient);
        }

        patient.prediction = getRegression().predict([
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
        if (patient.prediction < minPrediction) {
            minPrediction = patient.prediction;
        }
    });

    patientsList.forEach(patient => {
        patient.prediction = (patient.prediction - minPrediction) / (maxPrediction - minPrediction);
    });

    patientsList.sort((a, b) => a.prediction > b.prediction ? -1 : 1);

    /**
     * If there are patients with little behavior data, decrease amount of scored patients needed to 9 and put a random
     * little behavior data patient to the top of the list
     */
    if (patientsLittleBehaviorData.length) {
        amount--;
        scoredPatientsList.push(patientsLittleBehaviorData[Math.floor(Math.random() * patientsLittleBehaviorData.length)]);
        scoredPatientsList[0].prediction = 0.1;
    }

    /**
     * Concat the patients lists with its scores at a 1 to 10 factor
     * @type {{score: string, name: string, id: number}[]}
     */
    scoredPatientsList = scoredPatientsList.concat(patientsList.slice(0, amount)).map(patient => {
        return {id: patient.id, name: patient.name, score: Math.ceil(patient.prediction * 10)};
    });

    if (scoredPatientsList && scoredPatientsList.length >= 1) {
        return res.status(200).send({patients: scoredPatientsList});
    } else {
        res.status(202).send({patients: []})
    }

};

module.exports = {
    getListOfScoredPatients,
};
