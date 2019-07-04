/* NOTE: I got these distance calculation functions from StackOverflow
 *  In a production application it would be better to use
 *  a more accurate calculation method.
 *  For example: consuming the GoogleMaps API to calculate
 *  true driving distance from patient to practice
 * */

/**
 * This function takes in the lattitude and longitude of two locations
 *  and returns the distance between them in KM
 *
 * @param {number} lat1
 * @param {number} long1
 * @param {number} lat2
 * @param {number} long2
 */

function getDistanceToPractice(lat1, long1, lat2, long2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(long2 - long1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

/**
 * Convert degrees to Radians,
 * @param {*} deg
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = getDistanceToPractice;
