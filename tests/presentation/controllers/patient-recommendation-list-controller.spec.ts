import patientsSample from "@/assets/patients.json";

import { MissingParamError } from "@/presentation/errors";
import { ok, noContent, badRequest, serverError } from "@/presentation/helpers";
import { PatientRecommendationListController } from "@/presentation/controllers";

import { PatientsTopListGeneratorSpy } from "@/tests/main/services/mocks";

const makeSut = () => {
  const topListGeneratorSpy = new PatientsTopListGeneratorSpy();
  const sut = new PatientRecommendationListController(topListGeneratorSpy);

  return {
    sut,
    topListGeneratorSpy,
  };
};

describe("PatientRecommendationListController", () => {
  it("Should call PatientsTopListGeneratorService with correct params", () => {
    const { sut, topListGeneratorSpy } = makeSut();

    const facilityCoordinates = { lat: "20", lng: "-40" };

    sut.handle(facilityCoordinates);

    expect(topListGeneratorSpy.input).toEqual({
      patients: patientsSample,
      facilityCoords: {
        latitude: facilityCoordinates.lat,
        longitude: facilityCoordinates.lng,
      },
      amount: 10,
      littleBehaviorProportion: 0.1,
      littleBehaviorScoreEdge: 0.3,
    });
  });

  it("Should return 500 server error when PatientsTopListGeneratorService throws", async () => {
    const { sut, topListGeneratorSpy } = makeSut();

    const facilityCoordinates = { lat: "20", lng: "-40" };

    const errorToThrow = new Error("Caused by error");

    topListGeneratorSpy.error = errorToThrow;

    const httpResponse = await sut.handle(facilityCoordinates);

    expect(httpResponse).toStrictEqual(serverError(errorToThrow));
  });

  it("Should return 400 bad request missing param 'lat' when lat is falsy", async () => {
    const { sut } = makeSut();

    const cases = [0, -0, undefined, null, false, NaN];

    for (const lat of cases) {
      const httpResponse = await sut.handle({
        // @ts-expect-error
        lat,
        lng: "-120",
      });

      expect(httpResponse).toStrictEqual(
        badRequest(new MissingParamError("lat"))
      );
    }
  });

  it("Should return 400 bad request missing param 'lng' when lng is falsy", async () => {
    const { sut } = makeSut();

    const cases = [0, -0, undefined, null, false, NaN];

    for (const lng of cases) {
      const httpResponse = await sut.handle({
        lat: "40",
        // @ts-expect-error
        lng,
      });

      expect(httpResponse).toStrictEqual(
        badRequest(new MissingParamError("lng"))
      );
    }
  });

  it("Should return 204 no content when PatientsTopListGeneratorService returns empty", async () => {
    const { sut, topListGeneratorSpy } = makeSut();

    const facilityCoordinates = { lat: "20", lng: "-40" };

    topListGeneratorSpy.result = [];

    const httpResponse = await sut.handle(facilityCoordinates);

    expect(httpResponse).toStrictEqual(noContent());
  });

  it("Should return 200 and patients successfully", async () => {
    const { sut, topListGeneratorSpy } = makeSut();

    const facilityCoordinates = { lat: "20", lng: "-40" };

    const patientsWithScore = [
      {
        name: "Jim Halpert",
        location: { latitude: "40", longitude: "-130" },
        distance: 60.23575179961929,
        age: 16,
        acceptedOffers: 95,
        canceledOffers: 20,
        averageReplyTime: 100,
        id: "1",
        score: 0.9897166396053949,
        littleBehaviorScore: 0.789716639605395,
      },
      {
        name: "Michael Scott",
        location: { latitude: "40", longitude: "-130" },
        age: 30,
        acceptedOffers: 3,
        canceledOffers: 1,
        averageReplyTime: 120,
        id: "2",
        distance: 47.97939542381462,
        score: 0.5303560349554011,
        littleBehaviorScore: 0.33035603495540106,
      },
      {
        name: "Dwight Kurt Schrute",
        location: { latitude: "40", longitude: "-130" },
        age: 45,
        acceptedOffers: 5,
        canceledOffers: 2,
        averageReplyTime: 300,
        id: "3",
        distance: 42.352452649096996,
        score: 0.17806086713190594,
        littleBehaviorScore: 0,
      },
      {
        name: "Ryan Howard",
        location: { latitude: "40", longitude: "-130" },
        age: 45,
        acceptedOffers: 5,
        canceledOffers: 2,
        averageReplyTime: 300,
        id: "4",
        distance: 41.312720015592234,
        score: 0.15354101672558307,
        littleBehaviorScore: 0,
      },
      {
        name: "Ted Mosby, Architect",
        location: { latitude: "80.6552", longitude: "-100.3033" },
        age: 38,
        acceptedOffers: 66,
        canceledOffers: 6,
        averageReplyTime: 1639,
        id: "5",
        distance: 7.743266360454526,
        score: 0.2225543812195896,
        littleBehaviorScore: 0.02255438121958958,
      },
      {
        name: "Barney Stinson",
        location: { latitude: "-46.2905", longitude: "108.2977" },
        age: 49,
        acceptedOffers: 74,
        canceledOffers: 58,
        averageReplyTime: 3075,
        id: "6",
        distance: 70.26461042490692,
        score: 0.10556914665621941,
        littleBehaviorScore: 0,
      },
      {
        name: "Jake Peralta",
        location: { latitude: "-45.7169", longitude: "-129.6572" },
        age: 88,
        acceptedOffers: 35,
        canceledOffers: 5,
        averageReplyTime: 1680,
        id: "7",
        distance: 66.92387819209095,
        score: 0.8300134523844895,
        littleBehaviorScore: 0.6300134523844896,
      },
      {
        name: "Rosa Diaz",
        location: { latitude: "-46.9567", longitude: "-51.6463" },
        age: 64,
        acceptedOffers: 77,
        canceledOffers: 87,
        averageReplyTime: 2810,
        id: "8",
        distance: 35.89038503442732,
        score: 0.2710551294932817,
        littleBehaviorScore: 0.07105512949328169,
      },
      {
        name: "Terry Jeffords",
        location: { latitude: "-81.1386", longitude: "108.1122" },
        age: 85,
        acceptedOffers: 82,
        canceledOffers: 22,
        averageReplyTime: 1509,
        id: "9",
        distance: 23.14695320590918,
        score: 0.29583613072671877,
        littleBehaviorScore: 0.09583613072671876,
      },
      {
        name: "Captain Raymond Holt",
        location: { latitude: "-38.0533", longitude: "-89.5153" },
        age: 50,
        acceptedOffers: 29,
        canceledOffers: 11,
        averageReplyTime: 1723,
        id: "10",
        distance: 20.02197549482778,
        score: 0.006868057521148829,
        littleBehaviorScore: 0,
      },
      {
        name: "Angela Martin",
        location: { latitude: "24.0066", longitude: "-79.8183" },
        age: 54,
        acceptedOffers: 75,
        canceledOffers: 45,
        averageReplyTime: 3258,
        id: "11",
        distance: 55.27985896154357,
        score: 0.08232976848383045,
        littleBehaviorScore: 0,
      },
      {
        name: "Toby Flenderson",
        location: { latitude: "-70.2414", longitude: "69.3593" },
        age: 52,
        acceptedOffers: 2,
        canceledOffers: 20,
        averageReplyTime: 731,
        id: "12",
        distance: 83.36147984844932,
        score: 0.6117261667059173,
        littleBehaviorScore: 0.4117261667059173,
      },
      {
        name: "Marshall Eriksen",
        location: { latitude: "15.9479", longitude: "-161.4331" },
        age: 49,
        acceptedOffers: 14,
        canceledOffers: 94,
        averageReplyTime: 740,
        id: "13",
        distance: 70.76172969581651,
        score: 0.4922416470917108,
        littleBehaviorScore: 0.2922416470917108,
      },
      {
        name: "Lily Aldrin",
        location: { latitude: "31.9103", longitude: "-5.6675" },
        age: 52,
        acceptedOffers: 7,
        canceledOffers: 34,
        averageReplyTime: 287,
        id: "14",
        distance: 37.89196451042347,
        score: 0.5386195493765158,
        littleBehaviorScore: 0.3386195493765158,
      },
      {
        name: "Rick Sanchez",
        location: { latitude: "-59.0084", longitude: "-25.0715" },
        age: 78,
        acceptedOffers: 28,
        canceledOffers: 100,
        averageReplyTime: 2202,
        id: "15",
        distance: 38.29844817810102,
        score: 0.6992828081827076,
        littleBehaviorScore: 0.4992828081827076,
      },
      {
        name: "Morty Sanchez",
        location: { latitude: "-59.0084", longitude: "-25.0715" },
        age: 24,
        acceptedOffers: 41,
        canceledOffers: 75,
        averageReplyTime: 223,
        id: "16",
        distance: 96.41572224259407,
        score: 0.4125140572825374,
        littleBehaviorScore: 0.21251405728253742,
      },
      {
        name: "Walter White",
        location: { latitude: "58.5104", longitude: "17.8262" },
        age: 53,
        acceptedOffers: 0,
        canceledOffers: 11,
        averageReplyTime: 3596,
        id: "17",
        distance: 40.44841264256262,
        score: 0.33595189884586674,
        littleBehaviorScore: 0.13595189884586673,
      },
      {
        name: "Jesse Pinkman",
        location: { latitude: "-49.3177", longitude: "-23.1527" },
        age: 52,
        acceptedOffers: 5,
        canceledOffers: 15,
        averageReplyTime: 3350,
        id: "18",
        distance: 98.7596801320495,
        score: 0.9647223686127353,
        littleBehaviorScore: 0.7647223686127353,
      },
    ];

    topListGeneratorSpy.result = patientsWithScore;

    const patientsClean = patientsWithScore.map((x) => ({
      id: x.id,
      age: x.age,
      name: x.name,
      location: x.location,
    }));

    const httpResponse = await sut.handle(facilityCoordinates);

    expect(httpResponse).toStrictEqual(ok(patientsClean));
  });

  it("Should return 200 and patients with score when debug is passed as param", async () => {
    const { sut, topListGeneratorSpy } = makeSut();

    const httpRequest = { lat: "20", lng: "-40", debug: true };

    topListGeneratorSpy.result = [
      {
        name: "Jim Halpert",
        location: { latitude: "40", longitude: "-130" },
        distance: 60.23575179961929,
        age: 16,
        acceptedOffers: 95,
        canceledOffers: 20,
        averageReplyTime: 100,
        id: "1",
        score: 0.9897166396053949,
        littleBehaviorScore: 0.789716639605395,
      },
      {
        name: "Michael Scott",
        location: { latitude: "40", longitude: "-130" },
        age: 30,
        acceptedOffers: 3,
        canceledOffers: 1,
        averageReplyTime: 120,
        id: "2",
        distance: 47.97939542381462,
        score: 0.5303560349554011,
        littleBehaviorScore: 0.33035603495540106,
      },
      {
        name: "Dwight Kurt Schrute",
        location: { latitude: "40", longitude: "-130" },
        age: 45,
        acceptedOffers: 5,
        canceledOffers: 2,
        averageReplyTime: 300,
        id: "3",
        distance: 42.352452649096996,
        score: 0.17806086713190594,
        littleBehaviorScore: 0,
      },
      {
        name: "Ryan Howard",
        location: { latitude: "40", longitude: "-130" },
        age: 45,
        acceptedOffers: 5,
        canceledOffers: 2,
        averageReplyTime: 300,
        id: "4",
        distance: 41.312720015592234,
        score: 0.15354101672558307,
        littleBehaviorScore: 0,
      },
      {
        name: "Ted Mosby, Architect",
        location: { latitude: "80.6552", longitude: "-100.3033" },
        age: 38,
        acceptedOffers: 66,
        canceledOffers: 6,
        averageReplyTime: 1639,
        id: "5",
        distance: 7.743266360454526,
        score: 0.2225543812195896,
        littleBehaviorScore: 0.02255438121958958,
      },
      {
        name: "Barney Stinson",
        location: { latitude: "-46.2905", longitude: "108.2977" },
        age: 49,
        acceptedOffers: 74,
        canceledOffers: 58,
        averageReplyTime: 3075,
        id: "6",
        distance: 70.26461042490692,
        score: 0.10556914665621941,
        littleBehaviorScore: 0,
      },
      {
        name: "Jake Peralta",
        location: { latitude: "-45.7169", longitude: "-129.6572" },
        age: 88,
        acceptedOffers: 35,
        canceledOffers: 5,
        averageReplyTime: 1680,
        id: "7",
        distance: 66.92387819209095,
        score: 0.8300134523844895,
        littleBehaviorScore: 0.6300134523844896,
      },
      {
        name: "Rosa Diaz",
        location: { latitude: "-46.9567", longitude: "-51.6463" },
        age: 64,
        acceptedOffers: 77,
        canceledOffers: 87,
        averageReplyTime: 2810,
        id: "8",
        distance: 35.89038503442732,
        score: 0.2710551294932817,
        littleBehaviorScore: 0.07105512949328169,
      },
      {
        name: "Terry Jeffords",
        location: { latitude: "-81.1386", longitude: "108.1122" },
        age: 85,
        acceptedOffers: 82,
        canceledOffers: 22,
        averageReplyTime: 1509,
        id: "9",
        distance: 23.14695320590918,
        score: 0.29583613072671877,
        littleBehaviorScore: 0.09583613072671876,
      },
      {
        name: "Captain Raymond Holt",
        location: { latitude: "-38.0533", longitude: "-89.5153" },
        age: 50,
        acceptedOffers: 29,
        canceledOffers: 11,
        averageReplyTime: 1723,
        id: "10",
        distance: 20.02197549482778,
        score: 0.006868057521148829,
        littleBehaviorScore: 0,
      },
      {
        name: "Angela Martin",
        location: { latitude: "24.0066", longitude: "-79.8183" },
        age: 54,
        acceptedOffers: 75,
        canceledOffers: 45,
        averageReplyTime: 3258,
        id: "11",
        distance: 55.27985896154357,
        score: 0.08232976848383045,
        littleBehaviorScore: 0,
      },
      {
        name: "Toby Flenderson",
        location: { latitude: "-70.2414", longitude: "69.3593" },
        age: 52,
        acceptedOffers: 2,
        canceledOffers: 20,
        averageReplyTime: 731,
        id: "12",
        distance: 83.36147984844932,
        score: 0.6117261667059173,
        littleBehaviorScore: 0.4117261667059173,
      },
      {
        name: "Marshall Eriksen",
        location: { latitude: "15.9479", longitude: "-161.4331" },
        age: 49,
        acceptedOffers: 14,
        canceledOffers: 94,
        averageReplyTime: 740,
        id: "13",
        distance: 70.76172969581651,
        score: 0.4922416470917108,
        littleBehaviorScore: 0.2922416470917108,
      },
      {
        name: "Lily Aldrin",
        location: { latitude: "31.9103", longitude: "-5.6675" },
        age: 52,
        acceptedOffers: 7,
        canceledOffers: 34,
        averageReplyTime: 287,
        id: "14",
        distance: 37.89196451042347,
        score: 0.5386195493765158,
        littleBehaviorScore: 0.3386195493765158,
      },
      {
        name: "Rick Sanchez",
        location: { latitude: "-59.0084", longitude: "-25.0715" },
        age: 78,
        acceptedOffers: 28,
        canceledOffers: 100,
        averageReplyTime: 2202,
        id: "15",
        distance: 38.29844817810102,
        score: 0.6992828081827076,
        littleBehaviorScore: 0.4992828081827076,
      },
      {
        name: "Morty Sanchez",
        location: { latitude: "-59.0084", longitude: "-25.0715" },
        age: 24,
        acceptedOffers: 41,
        canceledOffers: 75,
        averageReplyTime: 223,
        id: "16",
        distance: 96.41572224259407,
        score: 0.4125140572825374,
        littleBehaviorScore: 0.21251405728253742,
      },
      {
        name: "Walter White",
        location: { latitude: "58.5104", longitude: "17.8262" },
        age: 53,
        acceptedOffers: 0,
        canceledOffers: 11,
        averageReplyTime: 3596,
        id: "17",
        distance: 40.44841264256262,
        score: 0.33595189884586674,
        littleBehaviorScore: 0.13595189884586673,
      },
      {
        name: "Jesse Pinkman",
        location: { latitude: "-49.3177", longitude: "-23.1527" },
        age: 52,
        acceptedOffers: 5,
        canceledOffers: 15,
        averageReplyTime: 3350,
        id: "18",
        distance: 98.7596801320495,
        score: 0.9647223686127353,
        littleBehaviorScore: 0.7647223686127353,
      },
    ];

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toStrictEqual(ok(topListGeneratorSpy.result));
  });
});
