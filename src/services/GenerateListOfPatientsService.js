/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
class GenerateListOfPatientsService {
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
