const convertDegreesToRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Calculate the distance in kilometers between two locations specified by
 * geographic coordinates (latitude, longitude) on Earth.
 *
 * @param {number} lat1 The latitude of the first location.
 * @param {number} lng1 The longitude of the first location.
 * @param {number} lat2 The latitude of the second location.
 * @param {number} lng2 The longitude of the second location.
 *
 * @returns {number} returns the distance in kilometers
 */
exports.calculateDistanceBetweenLocations = (lat1, lng1, lat2, lng2) => {
  // Earth radius in km
  const earthRadius = 6371;
  const lat1R = convertDegreesToRadians(lat1);
  const lat2R = convertDegreesToRadians(lat2);
  const lngDelta = convertDegreesToRadians(Math.abs(lng1 - lng2));
  const sigmaDelta = Math.acos(
    Math.sin(lat1R) * Math.sin(lat2R)
    + Math.cos(lat1R)
    * Math.cos(lat2R) * Math.cos(lngDelta)
  );

  return earthRadius * sigmaDelta;
};
