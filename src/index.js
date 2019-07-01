const { readPatientsData } = require('./readFileData');
const { filterPatientsByDistance } = require('./distanceFilter');
const { getTop10PatientsByRank } = require('./ranker');

const getBestPatientOptions = async (inputFile, facilityLocation) => {
  const patientList = await readPatientsData(inputFile, facilityLocation);
  const patientTaggedList = filterPatientsByDistance(facilityLocation,
    patientList.reduce((acc, patient) => ({
      ...acc,
      [patient.id]: {
        name: patient.name,
        location: patient.location,
        age: patient.age,
        acceptedOffers: patient.acceptedOffers,
        canceledOffers: patient.canceledOffers,
        averageReplyTime: patient.averageReplyTime,
      },
    }), {})
  );
  const top10Patients = getTop10PatientsByRank(patientTaggedList);
  return top10Patients;
}

module.exports = {
  getBestPatientOptions,
};
