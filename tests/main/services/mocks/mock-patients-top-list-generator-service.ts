import { IPatientsTopListGeneratorService } from "../../../../src/domain/services";

export class PatientsTopListGeneratorSpy
  implements IPatientsTopListGeneratorService
{
  filterLittleBehavior() {
    return [];
  }
  sortByScore() {
    return [];
  }

  input?: any;
  error?: Error;
  result: Patient[] = [];
  generate(
    patients: Patient[],
    facilityCoords: FacilityLocation,
    amount = 10,
    littleBehaviorProportion = 0.1,
    littleBehaviorScoreEdge = 0.3
  ): Patient[] {
    this.input = {
      patients,
      facilityCoords,
      amount,
      littleBehaviorProportion,
      littleBehaviorScoreEdge,
    };

    if (this.error) throw this.error;

    return this.result;
  }
}
