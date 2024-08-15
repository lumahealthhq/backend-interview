import type { Patient } from "@/domain/models";
import type { LocationCoords } from "@/domain/protocols";

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
