const ztable = require('ztable');
const {
  WEIGHT_ACCEPTED_OFFERS,
  WEIGHT_AGE,
  WEIGHT_CANCELLED_OFFERS,
  WEIGHT_DISTANCE,
  WEIGHT_REPLY_TIME,
} = require('../config/constants');

const calculateMean = (dataList) =>
  dataList.reduce((sum, dataItem) => sum + dataItem, 0) / dataList.length;

const calculateStandardDeviation = (dataList, mean) => {
  const average = calculateMean(dataList);
  const squareDiffList = dataList.map(dataItem => Math.pow(dataItem - average, 2));
  return Math.sqrt(squareDiffList.reduce((sum, diff) => sum + diff, 0) / squareDiffList.length);
}

const getScoreList = (itemList) => {
  const mean = calculateMean(itemList);
  const stdDeviation = calculateStandardDeviation(itemList, mean);
  return itemList.map(item => (item - mean) / stdDeviation);
}

const generatePatientsRank = (patients) => {
  const patientList = Object.keys(patients).map(patientId => patients[patientId]);
  const acceptedOffersScores = getScoreList(patientList.map(patient => patient.acceptedOffers));
  const ageScores = getScoreList(patientList.map(patient => patient.age));
  const canceledOffersScores = getScoreList(patientList.map(patient => patient.canceledOffers))
    .map(canceledOfferScore => 1 - canceledOfferScore);
  const distanceScores = getScoreList(patientList.map(patient => patient.distance));
  const replyTimeScores = getScoreList(patientList.map(patient => patient.averageReplyTime))
    .map(averageReplyTimeScore => 1 - averageReplyTimeScore);
  return Object.keys(patients).reduce((acc, patientId, index) => ({
    ...acc,
    [patientId]: {
      ...patients[patientId],
      score: {
        acceptedOffers: ztable(acceptedOffersScores[index]) * WEIGHT_ACCEPTED_OFFERS,
        age: ztable(ageScores[index]) * WEIGHT_AGE,
        canceledOffers: ztable(canceledOffersScores[index]) * WEIGHT_CANCELLED_OFFERS,
        distance: ztable(distanceScores[index]) * WEIGHT_DISTANCE,
        averageReplyTime: ztable(replyTimeScores[index]) * WEIGHT_REPLY_TIME,
      },
    },
  }), {});
}

const getTotalScore = patient => {
  const { score } = patient;
  const totalScore = (score.acceptedOffers + score.age + score.canceledOffers + score.distance
    + score.averageReplyTime) * 10
  if (totalScore < 1) return 1;
  return totalScore;
}

const getTop10PatientsByRank = (patients) => {
  const scoredPatients = generatePatientsRank(patients)
  const rankedPatients = Object.keys(scoredPatients)
    .map(patientId => ({
      ...scoredPatients[patientId],
      id: patientId,
    }))
    .sort((a, b) => {
      const rankA = getTotalScore(a);
      const rankB = getTotalScore(b);
      if (rankA > rankB) return -1;
      if (rankA === rankB) return 0;
      return 1;
    })
    .slice(0, 10);
  return rankedPatients.map(rankedPatient => ({
    id: rankedPatient.id,
    ...patients[rankedPatient.id],
  }));
}

module.exports = {
  getTop10PatientsByRank,
};