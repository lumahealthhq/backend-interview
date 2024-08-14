const { getPatientsWithScores } = require("./get-patients-with-scores");

require("../_types");

/**
 * @param {Patient[]} patients
 * @param {number} littleBehaviorScoreEdge
 */
const filterLittleBehavior = (patients, littleBehaviorScoreEdge = 0.3) =>
  patients.filter((x) => x.littleBehaviorScore <= littleBehaviorScoreEdge);

/**
 * @param {Patient[]} patients
 */
const sortByScore = (patients) => patients.sort((a, b) => b.score - a.score);

/**
 * Returns patients that are most likely to attend the appointment.
 *
 * List is generated based on:
 * - patients with highest scores;
 * - random patients with little behavior score
 *
 * @param {Patient[]} patients
 * @param {{ latitude: string, longitude: number }} facilityCoords
 * @param {number} amount Amount of patients to return
 * @param {number} littleBehaviorProportion Proportion (0 to 1) of little behavior patients to include on result. 1 is "all results are little behavior" and 0.1 is 1 out of 10.
 * @param {number} littleBehaviorScoreEdge Threshold that classifies patients as little behavior (less or equal than this value)
 */
const getPatientsTopList = (
  patients,
  facilityCoords,
  amount = 10,
  littleBehaviorProportion = 0.1,
  littleBehaviorScoreEdge = 0.3
) => {
  const patientsWithScoreSorted = sortByScore(
    getPatientsWithScores(patients, facilityCoords)
  );

  const amountToSelectFromLittleBehavior = littleBehaviorProportion * amount;
  const amountToSelectFromTopScore = amount - amountToSelectFromLittleBehavior;

  const topList = patientsWithScoreSorted.slice(0, amountToSelectFromTopScore);

  const patientsRest = patientsWithScoreSorted.slice(
    amountToSelectFromTopScore,
    patients.length
  );

  const patientsWithLittleBehavior = filterLittleBehavior(
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
};

module.exports = { filterLittleBehavior, sortByScore, getPatientsTopList };
