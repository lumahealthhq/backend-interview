import type { Patient } from "../../../src/domain/models";
import { PatientScoreCalculatorService } from "../../../src/data/services";

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
  describe("Calculates a score from 0 to 1 (worst to best) based on field normalization and weight", () => {
    const minMax = {
      age: { max: 50, min: 10 },
      acceptedOffers: { max: 95, min: 5 },
      canceledOffers: { max: 250, min: 20 },
      averageReplyTime: { max: 3000, min: 100 },
    };

    describe("Default Weight", () => {
      it("Should return a high score if normalized results are closer to 1", () => {
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

        expect(score).toBeCloseTo(1, 0);
        expect(littleBehaviorScore).toBeCloseTo(0.6, 0);
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

        expect(score).toBeCloseTo(0, 0);
        expect(littleBehaviorScore).toBeCloseTo(0, 0);
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

        expect(score).toBeCloseTo(0.5, 0);
        expect(littleBehaviorScore).toBe(0.4);
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

        expect(score).toBeCloseTo(1, 0);
        expect(littleBehaviorScore).toBe(0);
      });
    });
  });
});
