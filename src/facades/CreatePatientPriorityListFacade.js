import CalculatePatientDataRangeService from "../services/calculatePatientDataRangeService.js"
import CalculatePatientDistanceService from "../services/calculatePatientDistanceService.js"
import CalculatePatientScoreService from "../services/calculatePatientScoreService.js"
import CreatePatientPriorityListService from "../services/createPatientPriorityListService.js"
import NormalizePatientDataService from "../services/normalizePatientDataService.js"

class CreatePatientPriorityListFacade {
  create({
    patients,
    facilityLatitude,
    facilityLongitude,
    listSize = 10,
    littleBehavioralDataListPercentage = 0.4
  }) {

    const patientsWithDistance = new CalculatePatientDistanceService().execute({
      patients,
      facilityLatitude,
      facilityLongitude
    })

    const dataRange = new CalculatePatientDataRangeService().execute(patientsWithDistance)

    const normalizedPatients = new NormalizePatientDataService().execute({
      patients: patientsWithDistance,
      patientDataRange: dataRange
    })

    const scoredPatients = new CalculatePatientScoreService().execute(normalizedPatients)

    const patientPriorityList = new CreatePatientPriorityListService().execute({
      scoredPatients,
      listSize,
      littleBehavioralDataListPercentage
    })

    return patientPriorityList
  }
}

export default CreatePatientPriorityListFacade