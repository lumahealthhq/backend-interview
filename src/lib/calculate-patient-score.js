const { normalize } = require("./normalize");
const { distanceBetweenCoords } = require("./distance-between-coordinates");

require("../_types");

const WEIGHT = {
  age: 0.1,
  distance: 0.1,
  acceptedOffers: 0.3,
  canceledOffers: 0.3,
  replyTime: 0.2,
};

/**
 * @param {Patient} patient
 * @param {Object} officeCoords
 * @param {number} officeCoords.latitude
 * @param {number} officeCoords.longitude
 * @param {MinMaxPatientValues} minMaxValues
 *
 * @returns {number} score between 0 and 1, representing how likely the patient is to accept an appointment.
 */
module.exports.calculatePatientScore = (
  patient,
  officeCoords,
  minMaxValues
) => {
  // ? I plan to calculate this distance when mapping over patients and store it on patient object.
  // ? However I don't have that yet
  const officeDistance = distanceBetweenCoords(
    parseFloat(officeCoords.latitude, 10),
    parseFloat(officeCoords.longitude, 10),
    parseFloat(patient.location.latitude, 10),
    parseFloat(patient.location.longitude, 10)
  );

  // ? Assuming distances min=100 and max=0
  // ? The closer to the office, the higher the chance of accepting the appointment
  const distanceMax = 100;
  const distance =
    officeDistance > distanceMax
      ? 0
      : normalize(officeDistance, distanceMax, 0);

  // ? The younger, the higher the chance of accepting the appointment
  const age = normalize(
    patient.age,
    minMaxValues.age.max,
    minMaxValues.age.min
  );

  // ? The higher the amount of accepted offers, higher the possibility of accepting an offer
  const acceptedOffers = normalize(
    patient.acceptedOffers,
    minMaxValues.acceptedOffers.min,
    minMaxValues.acceptedOffers.max
  );

  // ? The lower the amount of canceled offers, the higher the possibility of accepting an offer
  const canceledOffers = normalize(
    patient.canceledOffers,
    minMaxValues.canceledOffers.max,
    minMaxValues.canceledOffers.min
  );

  // ? The lower the reply time, higher the possibility of accepting an offer
  const averageReplyTime = normalize(
    patient.averageReplyTime,
    minMaxValues.averageReplyTime.max,
    minMaxValues.averageReplyTime.min
  );

  return (
    age * WEIGHT.age +
    distance * WEIGHT.distance +
    acceptedOffers * WEIGHT.acceptedOffers +
    canceledOffers * WEIGHT.canceledOffers +
    averageReplyTime * WEIGHT.replyTime
  );
};
