import { calculatePatientScore } from "../../src/lib/calculate-patient-score";

describe("calculatePatientScore", () => {
  describe("Calculates a score from 0 to 1 based on field normalization and weight", () => {
    const minMax = {
      age: { max: 50, min: 10 },
      acceptedOffers: { max: 95, min: 5 },
      canceledOffers: { max: 250, min: 20 },
      averageReplyTime: { max: 3000, min: 100 },
    };

    it("Should return a perfect score", () => {
      const patient = {
        id: "1",
        name: "Michael Scott",
        distance: 1,
        age: 16,
        acceptedOffers: 95,
        canceledOffers: 20,
        averageReplyTime: 100,
      };

      const { score, littleBehaviorScore } = calculatePatientScore(
        patient as Required<Patient>,
        minMax
      );

      expect(score).toBeCloseTo(1, 0);
      expect(littleBehaviorScore).toBe(0.8);
    });

    it("Should return a terrible score", () => {
      const patient = {
        id: "1",
        name: "Dwight Kurt Schrute",
        distance: 1000,
        // oldest
        age: 50,
        // lowest amount of accepted offers
        acceptedOffers: 5,
        // highest amount of canceled offers
        canceledOffers: 250,
        // takes longer to reply
        averageReplyTime: 3000,
      };

      const { score, littleBehaviorScore } = calculatePatientScore(
        patient as Required<Patient>,
        minMax
      );

      expect(score).toBeCloseTo(0, 0);
      expect(littleBehaviorScore).toBe(0);
    });

    it("Should return a mediocre score", () => {
      const patient = {
        id: "1",
        name: "Dwight Kurt Schrute",
        distance: 50,
        // average on everything
        age: 30,
        acceptedOffers: 50,
        canceledOffers: 135,
        averageReplyTime: 1550,
      };

      const { score, littleBehaviorScore } = calculatePatientScore(
        patient as Required<Patient>,
        minMax
      );

      expect(score).toBeCloseTo(0.5, 0);
      expect(littleBehaviorScore).toBe(0.4);
    });
  });
});
