import type { Patient } from "../models";
import type { LocationCoords } from "../protocols";

export interface IPatientsGetWithScoresService {
  get(
    patients: Patient[],
    facilityCoordinates: LocationCoords
  ): Required<Patient>[];
}
