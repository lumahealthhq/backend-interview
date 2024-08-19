import ScoresWeights from "../../@types/scores-weights";

export interface RecommenderConfig {
  weights: ScoresWeights;

  /**
   * Distance bigger than `thresholdLocationDistance` (in miles) will be awarded no points in the recommendation selection process
   */
  thresholdLocationDistance: number;

  /**
   * Patients that have less totalOffers than `lowDataThreshold` will have a random chance to be recommended
   */
  lowDataThreshold: number;

  /**
   * The ratio of best scoring patients for given hospital versus randomly selected due to low historical data
   */
  lowDataRecommendedRatio: number;
}

const defaultRecommenderConfig: RecommenderConfig = {
  weights: {
    age: 0.1,
    location: 0.1,
    offers: 0.6,
    replyTime: 0.2,
  },

  thresholdLocationDistance: 5_000,
  lowDataThreshold: 25,
  lowDataRecommendedRatio: 0.2,
}

export default defaultRecommenderConfig
