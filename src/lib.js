const distance = require('@turf/distance').default;
const { point } = require('@turf/helpers');

// Calculate distance between geographic coordinates
const calculateDistance = (locationA, locationB) => distance(
  point([locationA.latitude, locationA.longitude]),
  point([locationB.latitude, locationB.longitude]),
);

// Update range given value
const updateRange = (range, value) => ({
  max: range.max === null ? value : Math.max(range.max, value),
  min: range.min === null ? value : Math.min(range.min, value),
});

// Normalize value given range with either positive or negative correlation
const normalize = (value, range, isPositiveCorrelation) => {
  const denominator = range.max - range.min;
  if (denominator === 0) {
    return 1;
  }

  const numerator = isPositiveCorrelation ? value - range.min : range.max - value;
  return numerator / denominator;
};

// Scale a normalized score to given range
const scaleNormalized = (score, range) => score * (range.max - range.min) + range.min;

const randomInt = max => Math.floor(Math.random() * (max + 1));

module.exports = {
  calculateDistance,
  updateRange,
  normalize,
  scaleNormalized,
  randomInt,
};
