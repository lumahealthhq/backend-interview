import type { Patient } from "../models";
import type { LocationCoords } from "../protocols";

export interface IPatientsTopListGeneratorService {
  filterLittleBehavior(
    patients: Required<Patient>[],
    littleBehaviorScoreEdge?: number
  ): Patient[];

  sortByScore(patients: Required<Patient>[]): Patient[];

  generate(
    patients: Patient[],
    facilityCoords: LocationCoords,
    amount?: number,
    littleBehaviorProportion?: number,
    littleBehaviorScoreEdge?: number
  ): Patient[];
}
