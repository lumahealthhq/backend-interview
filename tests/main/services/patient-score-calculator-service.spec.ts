import type { Patient } from "@/domain/models";
import { PatientScoreCalculatorService } from "@/data/services";

import { PatientDataNormalizerSpy } from "./mocks";

const makeSut = () => {
  const normalizerSpy = new PatientDataNormalizerSpy();
  const sut = new PatientScoreCalculatorService(normalizerSpy);

  return {
    sut,
    normalizerSpy,
  } as const;
};

describe("PatientScoreCalculatorService", () => {
  describe("Calculates a score based on field normalization and weight", () => {
    const minMax = {
      age: { max: 50, min: 10 },
      acceptedOffers: { max: 95, min: 5 },
      canceledOffers: { max: 250, min: 20 },
      averageReplyTime: { max: 3000, min: 100 },
    };

    describe("Default Weight", () => {
      it("Should return a high score if normalized values are closer to 1", () => {
        const { sut, normalizerSpy } = makeSut();

        const patient = {
          name: "Michael Scott",
          distance: 1,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
        };

        normalizerSpy.normalizeResult = {
          age: 0.8,
          distance: 0.8,
          acceptedOffers: 0.8,
          averageReplyTime: 0.8,
          canceledOffers: 0.8,
        };

        const { score, littleBehaviorScore } = sut.calculate(
          patient as Required<Patient>,
          minMax
        );

        expect(score).toBeCloseTo(8, 0);
        expect(littleBehaviorScore).toBeCloseTo(6, 0);
      });

      it("Should return a terrible score if normalized results are closer to 0", () => {
        const { sut, normalizerSpy } = makeSut();

        const patient = {
          name: "Dwight Kurt Schrute",
          distance: 1000,
          age: 50,
          acceptedOffers: 5,
          canceledOffers: 250,
          averageReplyTime: 3000,
        };

        normalizerSpy.normalizeResult = {
          acceptedOffers: 0.1,
          age: 0.1,
          averageReplyTime: 0.1,
          canceledOffers: 0.1,
          distance: 0.1,
        };

        const { score, littleBehaviorScore } = sut.calculate(
          patient as Required<Patient>,
          minMax
        );

        expect(score).toBeCloseTo(1, 0);
        expect(littleBehaviorScore).toBeCloseTo(1, 0);
      });

      it("Should return a mediocre score if normalized results are close to 0.5", () => {
        const { sut, normalizerSpy } = makeSut();

        const patient = {
          name: "Ryan Howard",
          distance: 50,
          age: 30,
          acceptedOffers: 50,
          canceledOffers: 135,
          averageReplyTime: 1550,
        };

        normalizerSpy.normalizeResult = {
          acceptedOffers: 0.5,
          age: 0.5,
          averageReplyTime: 0.5,
          canceledOffers: 0.5,
          distance: 0.5,
        };

        const { score, littleBehaviorScore } = sut.calculate(
          patient as Required<Patient>,
          minMax
        );

        expect(score).toBeCloseTo(5, 0);
        expect(littleBehaviorScore).toBe(4);
      });

      it("Should return 0 as the lowest score, no matter how low the normalization results are", () => {
        const { sut, normalizerSpy } = makeSut();

        const patient = {
          name: "Ryan Howard",
          distance: 50,
          age: 30,
          acceptedOffers: 50,
          canceledOffers: 135,
          averageReplyTime: 1550,
        };

        normalizerSpy.normalizeResult = {
          acceptedOffers: -100,
          age: -100,
          averageReplyTime: -100,
          canceledOffers: -100,
          distance: -100,
        };

        const { score } = sut.calculate(patient as Required<Patient>, minMax);

        expect(score).toBe(0);
      });

      it("Should return distancePenalty if distance normalization result is lower than 0", () => {
        const { sut, normalizerSpy } = makeSut();

        const patient = {
          name: "Ryan Howard",
          distance: 50,
          age: 30,
          acceptedOffers: 50,
          canceledOffers: 135,
          averageReplyTime: 1550,
        };

        normalizerSpy.normalizeResult = {
          distance: -10,
          acceptedOffers: 0.5,
          age: 0.5,
          averageReplyTime: 0.5,
          canceledOffers: 0.5,
        };

        const { score, distancePenalty } = sut.calculate(
          patient as Required<Patient>,
          minMax
        );

        expect(score).toBe(0);
        expect(distancePenalty).toBe(normalizerSpy.normalizeResult.distance);
      });
    });

    describe("Custom Weight", () => {
      it("Should return a perfect score due to high age WEIGHT and terrible little behavior score due to poor results on behavior values", () => {
        const { sut, normalizerSpy } = makeSut();

        sut.WEIGHT = {
          age: 1,
          distance: 0,
          acceptedOffers: 0,
          canceledOffers: 0,
          replyTime: 0,
        };

        normalizerSpy.normalizeResult = {
          age: 1,
          distance: 0,
          acceptedOffers: 0,
          averageReplyTime: 0,
          canceledOffers: 0,
        };

        const patient = {
          name: "Michael Scott",
          distance: 1,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
        };

        const { score, littleBehaviorScore } = sut.calculate(
          patient as Required<Patient>,
          minMax
        );

        expect(score).toBeCloseTo(10, 0);
        expect(littleBehaviorScore).toBe(0);
      });
    });
  });
});
