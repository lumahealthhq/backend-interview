/*
 * Exports class LinearRegression
 *
 * Public Methods:
 *
 * constructor(features, labels, options)
 * - features and labels are in the array-of-arrays format.
 * - options are learningRate, maxIterations, and weights
 *
 * train() - uses gradient descent to train the model
 *
 * predict(observations)
 * - observations is the array-of-array of features for which to make a prediction
 * - returns the predicted value
 *
 * test(testFeatures, testLabels)
 * - testFeatures and testLabels are in the array-of-arrays format
 * - returns the coefficient of determination for the test set
 *
 * This module uses tensorflow for the matrix calculations necessary to build the model and make predictions.
 */
require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
tf.disableDeprecationWarnings();

class LinearRegression {
    constructor(features, labels, options) {
        this.options = Object.assign({learningRate: 0.1, maxIterations: 1000}, options);
        this.features = this.processFeatures(features);
        this.labels = tf.tensor(labels);

         this.params = tf.zeros([this.features.shape[1], 1]);    //the initial values for b and m
        this.mseHistory = [];
    }

    gradientDescent() {
        //vectorized gradient descent
        //slope of MSE with respect to M and B: (Features * ((Features * Weights) - Labels))/n, across m1, m2, m3, etc. across all dimensions
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
        return this.processFeatures(observations).matMul(this.params).sum().get();
    }

    test(testFeatures, testLabels) {
        testFeatures = this.processFeatures(testFeatures);
        testLabels = tf.tensor(testLabels);

        const predictions = testFeatures.matMul(this.params);

        //calculate the coefficient of determination (aka R^2) using the test set to see a measure of the accuracy of our model (ss = Sum of Squares)
        const ssResiduals = testLabels.sub(predictions)
            .pow(2)
            .sum()
            .get();
        const ssTotal = testLabels.sub(testLabels.mean())
            .pow(2)
            .sum()
            .get();

        return 1 - ssResiduals / ssTotal;
    }

    processFeatures(features) {
        features = tf.tensor(features);

        if (this.mean && this.variance) {
            //we must have already standardized, so we need to use the same mean and variance values as previously calculated
            features = features.sub(this.mean).div(this.variance.pow(0.5));
            if (this.options.weights) {
                let weights = tf.tensor(this.options.weights);
                features = features.mul(weights);
            }
        }
        else {
            features = this.standarize(features);
        }

        features = tf.ones([features.shape[0], 1]).concat(features, 1);

        return features;
    }

    standarize(features) {
        //standardize the features, (value - mean)/standard-deviation; relative values
        const { mean, variance } = tf.moments(features, 0);

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
        //save the Mean Squared Error value of this iteration; we will use this for learning rate optimization
        const mse = this.features
            .matMul(this.params)
            .sub(this.labels)
            .pow(2)
            .sum()
            .div(this.features.shape[0])
            .get();

        this.mseHistory.unshift(mse);   //most recent first
    }

    updateLearningRate() {
        //note: there are more sophisticated learning rate optimization algorithms, like adam and others,
        // but I have found this simple approach works fine, and keeping code simple is a virtue
        if (this.mseHistory.length < 2) {
            return;
        }

        if (this.mseHistory[0] > this.mseHistory[1]) {  //index 0 is most recent value
            //mse getting worse, so decrease the learning rate value
            this.options.learningRate /= 2; //divide the learning rate by 2
        }
        else {
            //mse went down, so we can slightly increase the learning rate to converge on a value more quickly
            this.options.learningRate *= 1.05;
        }
    }
}

module.exports = LinearRegression;