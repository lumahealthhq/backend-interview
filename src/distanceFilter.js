const { EARTH_RADIUS_KM, MAX_PATIENT_DISTANCE } = require('../config/constants');

const calculateDistanceBetweenCoordinatesInKm = (lat1, lat2, lon1, lon2) => {
  const DEG_TO_RAD = Math.PI / 180;
  const deltaLat = Math.abs(lat1 - lat2) * DEG_TO_RAD;
  const deltaLon = Math.abs(lon1 - lon2) * DEG_TO_RAD;
  const a = Math.pow(Math.sin(deltaLat/2), 2)
    + (Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.pow(Math.sin(deltaLon/2), 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

const filterPatientsByDistance = (facilityLocation, patientList) => {
  const { latitude, longitude } = facilityLocation;
  return Object.keys(patientList).filter(patientId => {
    const patient = patientList[patientId];
    const { latitude: patLat, longitude: patLon } = patient.location;
    const distance = calculateDistanceBetweenCoordinatesInKm(patLat, latitude, patLon, longitude);

    return MAX_PATIENT_DISTANCE >= distance;
  }).reduce((acc, patientId) => ({
    ...acc,
    [patientId]: {
      ...patientList[patientId],
      distance: calculateDistanceBetweenCoordinatesInKm(patientList[patientId].location.latitude, latitude,
        patientList[patientId].location.longitude, longitude),
    },
  }), {});
}

module.exports = {
  filterPatientsByDistance,
};