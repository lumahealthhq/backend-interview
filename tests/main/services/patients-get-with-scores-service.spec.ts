import type { Patient } from "@/domain/models";
import { PatientsGetWithScoresService } from "@/data/services";

import {
  PatientScoreCalculatorSpy,
  PatientDataMinMaxCalculatorSpy,
  DistanceBetweenCoordinatesCalculatorSpy,
} from "./mocks";

const makeSut = () => {
  const scoreCalculatorSpy = new PatientScoreCalculatorSpy();
  const minMaxCalculatorSpy = new PatientDataMinMaxCalculatorSpy();
  const distanceBetweenCoordsSpy =
    new DistanceBetweenCoordinatesCalculatorSpy();

  const sut = new PatientsGetWithScoresService(
    scoreCalculatorSpy,
    minMaxCalculatorSpy,
    distanceBetweenCoordsSpy
  );

  return {
    sut,
    scoreCalculatorSpy,
    minMaxCalculatorSpy,
    distanceBetweenCoordsSpy,
  };
};

describe("PatientsGetWithScoresService", () => {
  it("Should call PatientDataMinMaxCalculatorService with correct params", () => {
    const { sut, minMaxCalculatorSpy } = makeSut();

    const patients = [
      {
        age: 45,
        acceptedOffers: 50,
        canceledOffers: 20,
        averageReplyTime: 300,
        location: { latitude: "1", longitude: "1" },
      },
    ];

    sut.get(patients as Patient[], {
      latitude: "40",
      longitude: "-120",
    });

    expect(minMaxCalculatorSpy.input).toEqual(patients);
  });
  it("Should throw when PatientDataMinMaxCalculatorService throws", () => {
    const { sut, minMaxCalculatorSpy } = makeSut();

    const errorToThrow = new Error("123123");
    jest.spyOn(minMaxCalculatorSpy, "calculate").mockImplementationOnce(() => {
      throw errorToThrow;
    });

    try {
      sut.get([], {
        latitude: "40",
        longitude: "-120",
      });

      // ensure it nevers reach here
      expect(1).toBe(0);
    } catch (e) {
      expect(e).toEqual(errorToThrow);
    }
  });

  it("Should call DistanceBetweenCoordinatesCalculatorService with correct params", () => {
    const { sut, distanceBetweenCoordsSpy } = makeSut();

    const patients = [
      {
        age: 45,
        acceptedOffers: 50,
        canceledOffers: 20,
        averageReplyTime: 300,
        location: { latitude: "1", longitude: "1" },
      },
    ];

    const facilityCoordinates = {
      latitude: "40",
      longitude: "-120",
    };

    sut.get(patients as Patient[], facilityCoordinates);

    expect(distanceBetweenCoordsSpy.input).toEqual({
      lat1: parseFloat(facilityCoordinates.latitude),
      lng1: parseFloat(facilityCoordinates.longitude),
      lat2: parseFloat(patients[0].location.latitude),
      lng2: parseFloat(patients[0].location.longitude),
    });
  });

  it("Should call PatientScoreCalculatorSpyService with patient and results from PatientDataMinMaxCalculatorService and DistanceBetweenCoordinatesCalculatorService", () => {
    const {
      sut,
      scoreCalculatorSpy,
      distanceBetweenCoordsSpy,
      minMaxCalculatorSpy,
    } = makeSut();

    const patients = [
      {
        age: 45,
        acceptedOffers: 50,
        canceledOffers: 20,
        averageReplyTime: 300,
        location: { latitude: "1", longitude: "1" },
      },
    ];

    const minMaxMock = {
      acceptedOffers: { min: 100, max: 500 },
      canceledOffers: { min: 100, max: 500 },
      age: { min: 100, max: 500 },
      averageReplyTime: { min: 100, max: 500 },
    };
    minMaxCalculatorSpy.result = minMaxMock;

    const distanceMock = 10000;
    distanceBetweenCoordsSpy.result = distanceMock;

    sut.get(patients as Patient[], {
      latitude: "40",
      longitude: "-120",
    });

    expect(scoreCalculatorSpy.input).toEqual({
      patient: {
        ...patients[0],
        distance: distanceMock,
      },
      minMaxValues: minMaxMock,
    });
  });

  it("Should return empty when provided patients list is empty", () => {
    const { sut } = makeSut();

    const result = sut.get([], {
      latitude: "40",
      longitude: "-120",
    });

    expect(result).toEqual([]);
  });

  it("Should return patients with score from PatientScoreCalculatorSpyService and distance from DistanceBetweenCoordinatesCalculatorService", () => {
    const { sut, distanceBetweenCoordsSpy, scoreCalculatorSpy } = makeSut();

    const patients = [
      {
        location: { latitude: "40", longitude: "-130" },
        age: 30,
        acceptedOffers: 3,
        canceledOffers: 1,
        averageReplyTime: 120,
      },
      {
        location: { latitude: "40", longitude: "-130" },
        age: 45,
        acceptedOffers: 5,
        canceledOffers: 2,
        averageReplyTime: 300,
      },
    ];

    const distanceMock = 9.9999;
    distanceBetweenCoordsSpy.result = distanceMock;

    const scoreMock = {
      score: 0.9,
      littleBehaviorScore: 0.4,
    };
    scoreCalculatorSpy.result = scoreMock;

    const result = sut.get(patients as Patient[], {
      latitude: "40",
      longitude: "-120",
    });

    expect(result).toEqual([
      {
        ...patients[0],
        distance: distanceMock,
        score: scoreMock.score,
        littleBehaviorScore: scoreMock.littleBehaviorScore,
      },
      {
        ...patients[1],
        distance: distanceMock,
        score: scoreMock.score,
        littleBehaviorScore: scoreMock.littleBehaviorScore,
      },
    ]);
  });
});
