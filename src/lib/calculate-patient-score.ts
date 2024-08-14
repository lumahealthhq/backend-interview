const { normalize } = require("./normalize");

const WEIGHT = {
  age: 0.1,
  distance: 0.1,
  acceptedOffers: 0.3,
  canceledOffers: 0.3,
  replyTime: 0.2,
};

export const calculatePatientScore = (
  patient: Required<Patient>,
  minMaxValues: MinMaxPatientValues
) => {
  // ? Assuming distances min=100 and max=0
  // ? The closer to the office, the higher the chance of accepting the appointment
  const distanceMax = 100;
  const distance =
    patient.distance > distanceMax
      ? 0
      : normalize(patient.distance, distanceMax, 0);

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

  const littleBehaviorScore =
    acceptedOffers * WEIGHT.acceptedOffers +
    canceledOffers * WEIGHT.canceledOffers +
    averageReplyTime * WEIGHT.replyTime;

  const score =
    age * WEIGHT.age + distance * WEIGHT.distance + littleBehaviorScore;

  return {
    score,
    littleBehaviorScore,
  };
};
