/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/**
 * Service responsible for generating the list of the most promising patients to attend the appointment
 */
class GenerateListOfPatientsService {
  /**
   * Returns the patients that will most likely attend the appointment.
   * Two portions of the list are going to be generated: patients with the highest scores; patients with little behavior score
   * Execute the service
   * @param {Object[]} patients List of patients with score calculated
   * @param {*} topListLength Length of the list to be generated
   * @param {*} littleBehaviorFraction Fraction of the list to be generated for adding patients with little behavior score.
   * @param {*} littleBehaviorScoreThreshold Behavior score threshold for patients to be added.
   */
  execute(
    patients,
    topListLength = 10,
    littleBehaviorFraction = 0.3,
    littleBehaviorScoreThreshold = 1.2,
  ) {
    if (patients.length < topListLength) {
      throw new Error(
        'The number of patients to be sorted should be greater than the desired sorted list.',
      );
    }

    if (littleBehaviorFraction > 1) {
      throw new Error(
        "The parameter 'littleBehaviorFraction' must be lesser than 1.",
      );
    }

    if (topListLength < 1) {
      throw new Error(
        "The parameter 'topListLength' must be greater than zero.",
      );
    }

    if (littleBehaviorScoreThreshold < 1) {
      throw new Error(
        "The parameter 'littleBehaviorScoreThreshold' must be greater than zero.",
      );
    }

    // Number of patients to be added in the second portion of the list
    const littleBehaviorPatientsToAdd = topListLength * littleBehaviorFraction;

    const sortedPatients = patients.sort((p1, p2) => p2.score - p1.score);

    const topList = sortedPatients.slice(
      0,
      topListLength - littleBehaviorPatientsToAdd,
    );
    const restOfPatients = sortedPatients.slice(
      topListLength - littleBehaviorPatientsToAdd,
      patients.length,
    );

    const sortedByBehavior = restOfPatients.sort(
      (p1, p2) => p1.behaviorScore - p2.behaviorScore,
    );

    const littleBehaviorPatients = sortedByBehavior.filter(
      (patient) => Number(patient.behaviorScore) < littleBehaviorScoreThreshold,
    );

    // Adding random patients to the list
    for (let i = 0; i < littleBehaviorPatientsToAdd; i += 1) {
      const randomIndex = Math.floor(
        Math.random() * littleBehaviorPatients.length,
      );
      topList.push(littleBehaviorPatients[randomIndex]);
    }

    return topList;
  }
}

module.exports = GenerateListOfPatientsService;
