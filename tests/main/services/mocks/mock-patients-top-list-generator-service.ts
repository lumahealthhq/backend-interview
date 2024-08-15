import type { Patient } from "@/domain/models";
import type { LocationCoords } from "@/domain/protocols";
import type { IPatientsTopListGeneratorService } from "@/domain/services";

export class PatientsTopListGeneratorSpy
  implements IPatientsTopListGeneratorService
{
  filterLittleBehavior() {
    return [];
  }
  sort() {
    return [];
  }

  input?: any;
  error?: Error;
  result: Patient[] = [];
  generate(
    patients: Patient[],
    facilityCoords: LocationCoords,
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
