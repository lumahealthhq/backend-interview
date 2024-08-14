import type {
  IPatientsGetWithScoresService,
  IPatientScoreCalculatorService,
  IPatientDataMinMaxCalculatorService,
  IDistanceBetweenCoordinatesCalculatorService,
} from "../../domain/services";

export class PatientsGetWithScoresService
  implements IPatientsGetWithScoresService
{
  constructor(
    private readonly scoreCalculator: IPatientScoreCalculatorService,
    private readonly minMaxValuesCalculator: IPatientDataMinMaxCalculatorService,
    private readonly distanceBetweenCoordsCalculator: IDistanceBetweenCoordinatesCalculatorService
  ) {}

  get(
    patients: Patient[],
    facilityCoordinates: FacilityLocation
  ): Required<Patient>[] {
    const minMaxValues = this.minMaxValuesCalculator.calculate(patients);

    return patients.map((patient) => {
      const distance = this.distanceBetweenCoordsCalculator.calculate(
        parseFloat(facilityCoordinates.latitude),
        parseFloat(facilityCoordinates.longitude),
        parseFloat(patient.location.latitude),
        parseFloat(patient.location.longitude)
      );

      const { littleBehaviorScore, score } = this.scoreCalculator.calculate(
        { ...patient, distance } as Required<Patient>,
        minMaxValues
      );

      return {
        ...patient,
        score,
        distance,
        littleBehaviorScore,
      };
    });
  }
}
