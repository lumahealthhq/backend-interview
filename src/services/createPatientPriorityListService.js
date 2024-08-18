class CreatePatientPriorityListService {
  execute({ scoredPatients, listSize = 10, littleBehavioralDataListPercentage = 0.4 }) {
    this._validateParams({ scoredPatients, listSize, littleBehavioralDataListPercentage })

    const littleBehaviorPatients = scoredPatients.filter(patient => patient.hasLittleBehaviorData);

    // Determine the number of little behavioral data patients to select
    const numLittleBehaviorPatients = Math.floor(listSize * littleBehavioralDataListPercentage);

    // Randomly select the desired number of little behavioral data patients
    const selectedLittleBehaviorPatients = this._getRandomElements(
      littleBehaviorPatients, numLittleBehaviorPatients
    );

    // Sort the remaining patients by score in descending order
    const sortedScoredPatients = scoredPatients
      .filter(patient => !patient.hasLittleBehaviorData)
      .sort((a, b) => b.score - a.score);

    // Select the remaining patients to fill the list
    const selectedScoredPatients = sortedScoredPatients.slice(
      0, listSize - selectedLittleBehaviorPatients.length
    );

    // Combine the two lists, keeping the order of the high-scoring patients
    return [...selectedScoredPatients, ...selectedLittleBehaviorPatients];
  }

  _validateParams({ scoredPatients, listSize, littleBehavioralDataListPercentage }) {
    if (!Array.isArray(scoredPatients) || scoredPatients.length === 0) {
      return [];
    }

    if (typeof listSize !== 'number' || listSize <= 0) {
      throw new Error("listSize must be a positive number.");
    }

    if (typeof littleBehavioralDataListPercentage !== 'number' ||
      littleBehavioralDataListPercentage < 0 || littleBehavioralDataListPercentage > 1) {
      throw new Error("littleBehavioralDataListPercentage must be a number between 0 and 1.");
    }
  }

  _getRandomElements(arr, num) {
    const result = [];
    const clonedArray = [...arr]; // Clone the array to avoid mutating the original

    for (let i = 0; i < num; i++) {
      if (clonedArray.length === 0) break;

      const randomIndex = Math.floor(Math.random() * clonedArray.length);
      const randomElement = clonedArray.splice(randomIndex, 1)[0]; // Remove and get the element

      result.push(randomElement);
    }

    return result;
  }
}

export default CreatePatientPriorityListService