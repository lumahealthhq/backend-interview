const PatientsGenerator = require('../../services/PatientsGenerator');
const PatientsRanker = require('../../services/PatientsRanker');

class PatientController {
  patientsRank(request, response) {
    try {
      const { facilityLocation } = request.body;

      const randomPatientsQty = 30;
      const patients =
        request.body.patients || PatientsGenerator.call(randomPatientsQty);
      const patientsRank = PatientsRanker.call(patients, facilityLocation);

      return response.status(200).json(patientsRank);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PatientController();
