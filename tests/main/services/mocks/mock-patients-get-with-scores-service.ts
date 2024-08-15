import type { Patient } from "@/domain/models";
import type { LocationCoords } from "@/domain/protocols";
import type { IPatientsGetWithScoresService } from "@/domain/services";

export class PatientsGetWithScoresSpy implements IPatientsGetWithScoresService {
  input?: any;
  result: Required<Patient>[] = [];

  get(
    patients: Patient[],
    facilityCoordinates: LocationCoords
  ): Required<Patient>[] {
    this.input = { patients, facilityCoordinates };

    return this.result;
  }
}
