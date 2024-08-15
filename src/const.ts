/**
 * Correlation here means the higher the value, the better the result.
 */
export const weightParameter = {
  age: {percentage: 10, correlation: 0}, //  10%
  distanceToFacility: {percentage: 10, correlation: 1}, //  10%
  acceptedOffers: {percentage: 30, correlation: 0}, //  30%
  canceledOffers: {percentage: 30, correlation: 1}, //  30%
  averageReplyTime: {percentage: 20, correlation: 1}, //  20%
};
