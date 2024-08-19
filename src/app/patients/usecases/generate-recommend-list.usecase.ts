import { ScoredPatient } from "../../../@types/scored-patient";
import shuffleArray from "../../../utils/shuffle-array";

export default function generateRecommendListUsecase(
  listSize: number,
  bestScoringPatients: Required<ScoredPatient>[],
  lowHistoricalDataPatients: ScoredPatient[],
  lowHistoricalDataRatio: number = 0.2,
) {
  const list = []

  let bestScoringIdx = 0

  const lowDataSectionIdx = Math.floor(listSize * (1 - lowHistoricalDataRatio))

  for (bestScoringIdx; bestScoringIdx < lowDataSectionIdx; bestScoringIdx++) {
    const patient = bestScoringPatients[bestScoringIdx]
    list.push(patient)
  }

  shuffleArray(lowHistoricalDataPatients)
  for (let i = lowDataSectionIdx; i < listSize; i++) {
    const lowDataIdx = i - lowDataSectionIdx

    // If there's no more low historical data patients to fill the list
    // we'll continue using the bestScoringPatients
    if (lowDataIdx >= lowHistoricalDataPatients.length) {
      const bestScoring = bestScoringPatients[bestScoringIdx]
      list.push(bestScoring)

      bestScoringIdx++
      continue
    }

    const lowHistorical = lowHistoricalDataPatients[lowDataIdx] as any
    lowHistorical.low_data = true
    list.push(lowHistorical)
  }

  return list
}
