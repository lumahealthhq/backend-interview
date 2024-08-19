import Patient from "../../../@types/patient";

abstract class PatientsRepositoryAbstract {
  abstract getPatientsWaitlist(): Promise<Patient[]>;
}

export default PatientsRepositoryAbstract
