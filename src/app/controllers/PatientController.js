const yup = require('yup');
const PatientsGenerator = require('../../services/PatientsGenerator');
const PatientsRanker = require('../../services/PatientsRanker');

class PatientController {
  async patientsRank(request, response) {
    try {
      const schema = yup.object().shape({
        facilityLocation: yup.object().required(),
        patientsQty: yup.number().min(10),
      });

      const isSchemaValid = await schema.isValid(request.body);
      if (!isSchemaValid)
        return response.status(400).json({ error: 'Wrong request format' });

      const { facilityLocation, patientsQty } = request.body;

      const randomPatientsQty = patientsQty || 30;
      const patients =
        request.body.patients || PatientsGenerator.call(randomPatientsQty);
      const patientsRank = PatientsRanker.call(patients, facilityLocation);

      return response.status(200).json(patientsRank.reverse());
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PatientController();
