import type { Patient } from "@/domain/models";
import type { LocationCoords } from "@/domain/protocols";

export interface IPatientsGetWithScoresService {
  get(
    patients: Patient[],
    facilityCoordinates: LocationCoords
  ): Required<Patient>[];
}
