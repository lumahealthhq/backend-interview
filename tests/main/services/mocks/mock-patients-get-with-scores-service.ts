import { IPatientsGetWithScoresService } from "../../../../src/domain/services";

export class PatientsGetWithScoresSpy implements IPatientsGetWithScoresService {
  input?: any;
  result: Required<Patient>[] = [];

  get(
    patients: Patient[],
    facilityCoordinates: FacilityLocation
  ): Required<Patient>[] {
    this.input = { patients, facilityCoordinates };

    return this.result;
  }
}
