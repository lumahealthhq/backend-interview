/**
 * This file builds and trains the linear regression model
 *  using tensorflow.js layers API
 *
 * Additional things that could be done here:
 *  1. Compute the coefficient of determination for the data set
 *      This would tell us how well the data fits the regression
 *  2. Use a different test set of data to prevent over fitting our model
 */
require("@tensorflow/tfjs-node");
const tf = require("@tensorflow/tfjs");
const normalize = require("./dataUtils/normalization");

/**
 * Builds and returns Linear Regression Model.
 *
 * @returns {tf.Sequential} The linear regression model.
 */
function linearRegressionModel(preparedData) {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [preparedData.numFeatures],
      units: 1,
      options: { weights: [0.1, 0.1, 0.2, 0.3, 0.3] }
    })
  );

  model.summary();
  return model;
}

/**
 * Uses the generated model to make predictions
 *  from the pool of patients with sufficient data
 * @param {*} model
 */
function predict(model, preparedData) {
  let maxPrediction = 0;
  let minPrediction = 99;
  const sufficientDataList = preparedData.patientsWithSufficientData;

  sufficientDataList.forEach(patient => {
    patient.prediction = model
      .predict(
        tf.tensor2d(
          [
            patient.age,
            patient.distanceToPractice,
            patient.averageReplyTime,
            patient.acceptedOffers,
            patient.canceledOffers
          ],
          [1, 5]
        )
      )
      .dataSync();

    if (patient.prediction > maxPrediction) {
      maxPrediction = patient.prediction;
    }
    if (patient.prediction < minPrediction) {
      patient.prediction = minPrediction = patient.prediction;
    }
  });
  sufficientDataList.forEach(patient => {
    // normalize data 0-1
    patient.prediction =
      (patient.prediction - minPrediction) / (maxPrediction - minPrediction);
  });
  return sufficientDataList;
}

function arraysToTensors(preparedData) {
  const tensors = {};
  // Always shuffle data before training so that the model is not:
  // Learning things that are purely dependent on the order the data was fed in
  // Sensitive to the structure in subgroups
  tf.util.shuffle(preparedData.trainingFeatures);

  // Normalize mean and standard deviation of data.

  tensors.rawtrainingFeatures = tf.tensor2d(preparedData.trainingFeatures);
  let { dataMean, dataStd } = normalize.determineMeanAndStddev(
    tensors.rawtrainingFeatures
  );
  tensors.trainingTarget = tf.tensor2d(preparedData.trainingTarget);
  tensors.rawTestFeatures = tf.tensor2d(preparedData.testFeatures);
  tensors.testTarget = tf.tensor2d(preparedData.testTarget);

  tensors.trainingFeatures = normalize.normalizeTensor(
    tensors.rawtrainingFeatures,
    dataMean,
    dataStd
  );
  tensors.testFeatures = normalize.normalizeTensor(
    tensors.rawTestFeatures,
    dataMean,
    dataStd
  );
  return tensors;
}

/**
 * Compiles `model` and trains it using the train data and runs model against
 * test data.
 *
 * @param {tf.Sequential} model Model to be trained.
 */
async function run(model, tensors, preparedData) {
  // Some hyperparameters for model training.
  const NUM_EPOCHS = 2;
  const BATCH_SIZE = 50;
  const LEARNING_RATE = 0.01;
  try {
    model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE),
      loss: "meanSquaredError"
    });

    let trainLogs = [];
    await model.fit(tensors.trainingFeatures, tensors.trainingTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          trainLogs.push(logs);
        }
      }
    });
    return predict(model, preparedData);
  } catch (error) {
    console.log("Error running model:", error);
  }
}

async function buildAndRun(preparedData) {
  const tensors = await arraysToTensors(preparedData);
  const model = linearRegressionModel(preparedData);
  const predictions = await run(model, tensors, preparedData);
  return predictions;
}

module.exports = buildAndRun;
