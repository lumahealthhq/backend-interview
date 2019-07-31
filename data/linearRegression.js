require("@tensorflow/tfjs-node");

const geolib = require('geolib');

const patientsList = require('../data/trainingPatients.json');
const tf = require('@tensorflow/tfjs');
const WEIGHTS = require("../weights");
let regression;


tf.disableDeprecationWarnings();

/**
 *
 * @description All credits to @dwarthen for LinearRegression class, i have made only some fixes
 */
class LinearRegression {
    constructor(features, labels, options) {
        this.options = options;
        this.features = this.processFeatures(features);
        this.labels = tf.tensor(labels);

        this.params = tf.zeros([this.features.shape[1], 1]);
        this.mseHistory = [];
    }

    gradientDescent() {
        const currentGuesses = this.features.matMul(this.params);
        const differences = currentGuesses.sub(this.labels);
        const slopes = this.features
            .transpose()
            .matMul(differences)
            .div(this.features.shape[0]);
        this.params = this.params.sub(slopes.mul(this.options.learningRate));
    }


    train() {
        for (let i = 0; i < this.options.maxIterations; i++) {
            this.gradientDescent();
            this.recordMSE();
            this.updateLearningRate();
        }
    }

    predict(observations) {
        return this.processFeatures(observations).matMul(this.params).sum().dataSync();
        // return this.processFeatures(observations).matMul(this.params).sum().get();

    }


    processFeatures(features) {
        features = tf.tensor(features);

        if (this.mean && this.variance) {
            features = features.sub(this.mean).div(this.variance.pow(0.5));
            if (this.options.weights) {
                let weights = tf.tensor(this.options.weights);
                features = features.mul(weights);
            }
        } else {
            features = this.standarize(features);
        }

        features = tf.ones([features.shape[0], 1]).concat(features, 1);

        return features;
    }

    standarize(features) {
        const {mean, variance} = tf.moments(features, 0);

        this.mean = mean;
        this.variance = variance;

        features = features.sub(mean).div(variance.pow(0.5));
        if (this.options.weights) {
            let weights = tf.tensor(this.options.weights);
            features = features.mul(weights);
        }
        return features;
    }

    recordMSE() {
        const mse = this.features
            .matMul(this.params)
            .sub(this.labels)
            .pow(2)
            .sum()
            .div(this.features.shape[0])
            .dataSync();
        // .get();

        this.mseHistory.unshift(mse);   //most recent first
    }

    updateLearningRate() {
        if (this.mseHistory.length < 2) {
            return;
        }
        if (this.mseHistory[0] > this.mseHistory[1]) {
            this.options.learningRate /= 2;
        } else {
            this.options.learningRate *= 1.05;
        }
    }
}


let trainModel = () => {
    let lat = 0;
    let lon = 0;
    let trainingSet = [];
    let arrayTrainingFeatures = [];
    let arrayTrainingLabels = [];


    try {

        if (!patientsList || patientsList.length <= 20) throw "Insufficient Data for Training";
        patientsList.forEach((patient) => {

            patient.distance = geolib.getDistance({latitude: lat, longitude: lon}, {
                latitude: patient.location.latitude,
                longitude: patient.location.longitude
            });

            const offerCount = patient.acceptedOffers + patient.canceledOffers;
            if (offerCount > 0) {
                patient.acceptProb = patient.acceptedOffers / offerCount;
            } else {
                patient.acceptProb = 0
            }

            trainingSet.push(patient)
        });

        trainingSet.forEach(patient => {
            arrayTrainingFeatures.push([patient.distance, patient.age, patient.averageReplyTime, patient.acceptedOffers, patient.canceledOffers]);
            arrayTrainingLabels.push([patient.acceptProb]);
        });

        regression = new LinearRegression(arrayTrainingFeatures, arrayTrainingLabels, {
            learningRate: 0.01,
            maxIterations: 1000,
            weights: [WEIGHTS.DISTANCE, WEIGHTS.AGE, WEIGHTS.REPLY_TIME, WEIGHTS.ACCEPTED_OFFERS, WEIGHTS.CANCELLED_OFFERS]
        });

        regression.train();

        console.log('TRAINING DONE');
        return true;
    } catch (e) {
        console.log('ERROR TRAINING DATA: ', JSON.stringify(e));
        return false;
    }
};

getRegression = () => regression;

module.exports = {getRegression, trainModel};
