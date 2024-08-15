import type {
  IPatientsGetWithScoresService,
  IPatientsTopListGeneratorService,
} from "@/domain/services";
import type { Patient } from "@/domain/models";
import type { LocationCoords } from "@/domain/protocols";

export class PatientsTopListGeneratorService
  implements IPatientsTopListGeneratorService
{
  constructor(
    private readonly patientsGetWithScores: IPatientsGetWithScoresService
  ) {}

  filterLittleBehavior(
    patients: Required<Patient>[],
    littleBehaviorScoreEdge = 0.3
  ) {
    return patients.filter(
      (x) => x.littleBehaviorScore <= littleBehaviorScoreEdge
    );
  }

  sortByScore(patients: Required<Patient>[]) {
    return patients.sort((a, b) => b.score - a.score);
  }

  /**
   * Returns patients that are most likely to attend the appointment.
   *
   * List is generated based on:
   * - patients with highest scores;
   * - random patients with little behavior score
   *
   * @param amount Amount of patients to return
   * @param littleBehaviorProportion Proportion (0 to 1) of little behavior patients to include on result. 1 is "all results are little behavior" and 0.1 is 1 out of 10.
   * @param littleBehaviorScoreEdge Threshold that classifies patients as little behavior (less or equal than this value)
   */
  generate(
    patients: Patient[],
    facilityCoords: LocationCoords,
    amount = 10,
    littleBehaviorProportion = 0.1,
    littleBehaviorScoreEdge = 0.3
  ) {
    const patientsWithScoreSorted = this.sortByScore(
      this.patientsGetWithScores.get(patients, facilityCoords)
    );

    const amountToSelectFromLittleBehavior = littleBehaviorProportion * amount;
    const amountToSelectFromTopScore =
      amount - amountToSelectFromLittleBehavior;

    const topList = patientsWithScoreSorted.slice(
      0,
      amountToSelectFromTopScore
    );

    const patientsRest = patientsWithScoreSorted.slice(
      amountToSelectFromTopScore,
      patients.length
    );

    const patientsWithLittleBehavior = this.filterLittleBehavior(
      patientsRest,
      littleBehaviorScoreEdge
    );

    for (let i = 0; i < amountToSelectFromLittleBehavior; i++) {
      // * Ensure there are items on each iteraction to avoid undefined values
      if (patientsWithLittleBehavior.length === 0) break;

      const randomIndex = Math.floor(
        Math.random() * patientsWithLittleBehavior.length
      );

      const patient = patientsWithLittleBehavior[randomIndex];

      topList.push(patient);

      // * Clean up chosen item to avoid duplicates
      patientsWithLittleBehavior.splice(randomIndex, 1);
    }

    return topList;
  }
}
