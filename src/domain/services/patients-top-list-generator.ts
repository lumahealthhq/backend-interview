export interface IPatientsTopListGeneratorService {
  filterLittleBehavior(
    patients: Required<Patient>[],
    littleBehaviorScoreEdge?: number
  ): Patient[];

  sortByScore(patients: Required<Patient>[]): Patient[];

  generate(
    patients: Patient[],
    facilityCoords: FacilityLocation,
    amount?: number,
    littleBehaviorProportion?: number,
    littleBehaviorScoreEdge?: number
  ): Patient[];
}