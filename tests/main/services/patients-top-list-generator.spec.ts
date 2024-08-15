import type { Patient } from "@/domain/models";
import { PatientsTopListGeneratorService } from "@/data/services";

import { PatientsGetWithScoresSpy } from "./mocks";

const makeSut = () => {
  const patientsGetWithScoresSpy = new PatientsGetWithScoresSpy();

  const sut = new PatientsTopListGeneratorService(patientsGetWithScoresSpy);

  return {
    sut,
    patientsGetWithScoresSpy,
  };
};

describe("PatientsTopListGeneratorService", () => {
  describe("sortByScore", () => {
    it("Should sort by score DESC and distance ASC and littleBehaviorScore DESC", () => {
      const { sut } = makeSut();

      const items = [
        { score: 30, distance: 10, littleBehaviorScore: 5 },
        { score: -1, distance: 1 },
        { score: 1, distance: 0 },
        { score: 1, distance: 1 },
        { score: 30, distance: 10, littleBehaviorScore: 3 },
        { score: 30, distance: 10, littleBehaviorScore: 4 },
        { score: 30, distance: 30 },
        { score: -10, distance: 99 },
        { score: 20, distance: 99 },
      ];

      // @ts-ignore
      const sortedItems = sut.sortByScore(items);

      expect(sortedItems).toStrictEqual([
        { score: 30, distance: 10, littleBehaviorScore: 5 },
        { score: 30, distance: 10, littleBehaviorScore: 4 },
        { score: 30, distance: 10, littleBehaviorScore: 3 },
        { score: 30, distance: 30 },
        { score: 20, distance: 99 },
        { score: 1, distance: 0 },
        { score: 1, distance: 1 },
        { score: -1, distance: 1 },
        { score: -10, distance: 99 },
      ]);
    });
  });

  describe("filterLittleBehavior", () => {
    it("Should return only items that have littleBehaviorScore smaller or equal than littleBehaviorScoreEdge", () => {
      const { sut } = makeSut();

      const items = [
        { littleBehaviorScore: 10 },
        { littleBehaviorScore: 7 },
        { littleBehaviorScore: 5 },
        { littleBehaviorScore: 4.5 },
        { littleBehaviorScore: 4 },
        { littleBehaviorScore: 3.2 },
        { littleBehaviorScore: 3 },
        { littleBehaviorScore: 0 },
      ];

      const littleBehaviorScoreEdge = 4;

      const itemsFiltered = sut.filterLittleBehavior(
        // @ts-ignore
        items,
        littleBehaviorScoreEdge
      );

      expect(itemsFiltered).toEqual([
        { littleBehaviorScore: 4 },
        { littleBehaviorScore: 3.2 },
        { littleBehaviorScore: 3 },
        { littleBehaviorScore: 0 },
      ]);
    });

    it("Should default littleBehaviorScoreEdge to 0.3 when not provided", () => {
      const { sut } = makeSut();

      const items = [
        { littleBehaviorScore: 0.4 },
        { littleBehaviorScore: 0.35 },
        { littleBehaviorScore: 0.3 },
        { littleBehaviorScore: 0.2 },
        { littleBehaviorScore: 0.1 },
        { littleBehaviorScore: 0 },
      ];

      // @ts-ignore
      const itemsFiltered = sut.filterLittleBehavior(items);

      expect(itemsFiltered).toEqual([
        { littleBehaviorScore: 0.3 },
        { littleBehaviorScore: 0.2 },
        { littleBehaviorScore: 0.1 },
        { littleBehaviorScore: 0 },
      ]);
    });
  });

  describe("get", () => {
    it("Should call sortByScore with result of PatientsGetWithScoresService", () => {
      const { sut, patientsGetWithScoresSpy } = makeSut();

      const patients = [
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
        },
        {
          name: "Erika Cassin",
          location: { latitude: "80.6552", longitude: "-100.3033" },
          age: 38,
          acceptedOffers: 66,
          canceledOffers: 6,
          averageReplyTime: 1639,
        },
      ] as Patient[];

      const patientsWithScore = [
        {
          ...patients[0],
          distance: 851.3551260515738,
          score: 0.7999999999999999,
          littleBehaviorScore: 0.7,
        },
        {
          ...patients[1],
          score: 0.6451012527055062,
          distance: 4591.366006792284,
          littleBehaviorScore: 0.5756568082610618,
        },
      ] as Required<Patient>[];

      const sortByScoreSpy = jest.spyOn(sut, "sortByScore");

      patientsGetWithScoresSpy.result = patientsWithScore;

      sut.generate(patients, { latitude: "40", longitude: "-120" });

      expect(sortByScoreSpy).toHaveBeenCalled();
      expect(sortByScoreSpy).toHaveBeenCalledWith(patientsWithScore);
    });

    it("Should call filterLittleBehavior without high scorers", () => {
      const { sut, patientsGetWithScoresSpy } = makeSut();

      const patients = [
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
        },
        {
          name: "Michael Scott",
          location: { latitude: "40", longitude: "-130" },
          age: 30,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 120,
        },
        {
          name: "Dwight Kurt Schrute",
          location: { latitude: "40", longitude: "-130" },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Erika Cassin",
          location: { latitude: "80.6552", longitude: "-100.3033" },
          age: 38,
          acceptedOffers: 66,
          canceledOffers: 6,
          averageReplyTime: 1639,
        },
      ] as Patient[];

      const patientsWithScore = [
        {
          ...patients[0],
          distance: 851.3551260515738,
          score: 0.7,
          littleBehaviorScore: 0.7,
        },
        {
          ...patients[1],
          distance: 10,
          score: 0.6,
          littleBehaviorScore: 0.6,
        },
        {
          ...patients[2],
          distance: 10,
          score: 0.3,
          littleBehaviorScore: 0.15,
        },
        {
          ...patients[3],
          distance: 10,
          score: 0.4,
          littleBehaviorScore: 0.2,
        },
      ] as Required<Patient>[];

      const filterLittleBehaviorSpy = jest.spyOn(sut, "filterLittleBehavior");

      patientsGetWithScoresSpy.result = patientsWithScore;

      const amountOfPatients = 4;
      const littleBehaviorProportion = 1 / 2;
      const littleBehaviorScoreEdge = 0.5;

      sut.generate(
        patients,
        { latitude: "40", longitude: "-120" },
        amountOfPatients,
        littleBehaviorProportion,
        littleBehaviorScoreEdge
      );

      expect(filterLittleBehaviorSpy).toHaveBeenCalled();
      expect(filterLittleBehaviorSpy).toHaveBeenCalledWith(
        [patientsWithScore[2], patientsWithScore[3]],
        littleBehaviorScoreEdge
      );
    });

    it("Should return 4 patients, two being top scorers and two with little behavior", () => {
      const { sut, patientsGetWithScoresSpy } = makeSut();

      const patients = [
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          distance: 1,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
        },
        {
          name: "Michael Scott",
          location: { latitude: "40", longitude: "-130" },
          age: 30,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 120,
        },
        {
          name: "Dwight Kurt Schrute",
          location: { latitude: "40", longitude: "-130" },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Ryan Howard",
          location: { latitude: "40", longitude: "-130" },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Erika Cassin",
          location: {
            latitude: "80.6552",
            longitude: "-100.3033",
          },
          age: 38,
          acceptedOffers: 66,
          canceledOffers: 6,
          averageReplyTime: 1639,
        },
        {
          name: "Malachi Prohaska",
          location: {
            latitude: "-46.2905",
            longitude: "108.2977",
          },
          age: 49,
          acceptedOffers: 74,
          canceledOffers: 58,
          averageReplyTime: 3075,
        },
        {
          name: "Jamie Hermiston",
          location: {
            latitude: "-45.7169",
            longitude: "-129.6572",
          },
          age: 88,
          acceptedOffers: 35,
          canceledOffers: 58,
          averageReplyTime: 3075,
        },
      ] as Patient[];

      patientsGetWithScoresSpy.result = [
        {
          ...patients[0],
          distance: 851.3551260515738,
          score: 0.7,
          littleBehaviorScore: 0.7,
        },
        {
          ...patients[1],
          distance: 10,
          score: 0.6,
          littleBehaviorScore: 0.6,
        },
        {
          ...patients[2],
          distance: 10,
          score: 0.3,
          littleBehaviorScore: 0.15,
        },
        {
          ...patients[3],
          distance: 10,
          score: 0.4,
          littleBehaviorScore: 0.2,
        },
        {
          ...patients[4],
          distance: 10,
          score: 0.6,
          littleBehaviorScore: 0.3,
        },
        {
          ...patients[5],
          distance: 10,
          score: 1,
          littleBehaviorScore: 0.8,
        },
      ] as Required<Patient>[];

      const amountOfPatients = 4;
      const littleBehaviorProportion = 2 / amountOfPatients;

      const littleBehaviorScoreEdge = 0.3;

      const topList = sut.generate(
        patients,
        {
          latitude: "40",
          longitude: "-120",
        },
        amountOfPatients,
        littleBehaviorProportion,
        littleBehaviorScoreEdge
      );

      expect(topList.length).toBe(4);
      expect(topList[0].littleBehaviorScore).toBeGreaterThan(
        littleBehaviorScoreEdge
      );
      expect(topList[1].littleBehaviorScore).toBeGreaterThan(
        littleBehaviorScoreEdge
      );
      expect(topList[2].littleBehaviorScore).toBeLessThanOrEqual(
        littleBehaviorScoreEdge
      );
      expect(topList[3].littleBehaviorScore).toBeLessThanOrEqual(
        littleBehaviorScoreEdge
      );
    });

    it("Should default 'amountToSelectFromTopScore' to 9 and 'littleBehaviorProportion' to 1, returning 10 patients, where 9 are top scorers and 1 is a random patient with little behavior", () => {
      const { sut, patientsGetWithScoresSpy } = makeSut();

      const patients = [
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          distance: 1,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
        },
        {
          name: "Michael Scott",
          location: { latitude: "40", longitude: "-130" },
          age: 30,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 120,
        },
        {
          name: "Dwight Kurt Schrute",
          location: { latitude: "40", longitude: "-130" },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Ryan Howard",
          location: { latitude: "40", longitude: "-130" },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Erika Cassin",
          location: {
            latitude: "80.6552",
            longitude: "-100.3033",
          },
          age: 38,
          acceptedOffers: 66,
          canceledOffers: 6,
          averageReplyTime: 1639,
        },
        {
          name: "Malachi Prohaska",
          location: {
            latitude: "-46.2905",
            longitude: "108.2977",
          },
          age: 49,
          acceptedOffers: 74,
          canceledOffers: 58,
          averageReplyTime: 3075,
        },
        {
          name: "Jamie Hermiston",
          location: {
            latitude: "-45.7169",
            longitude: "-129.6572",
          },
          age: 88,
          acceptedOffers: 35,
          canceledOffers: 5,
          averageReplyTime: 1680,
        },
        {
          name: "Edythe Hilpert",
          location: {
            latitude: "-46.9567",
            longitude: "-51.6463",
          },
          age: 64,
          acceptedOffers: 77,
          canceledOffers: 87,
          averageReplyTime: 2810,
        },
        {
          name: "Lacey Buckridge",
          location: {
            latitude: "-81.1386",
            longitude: "108.1122",
          },
          age: 85,
          acceptedOffers: 82,
          canceledOffers: 22,
          averageReplyTime: 1509,
        },
        {
          name: "Dr. Beryl Greenfelder",
          location: {
            latitude: "-38.0533",
            longitude: "-89.5153",
          },
          age: 50,
          acceptedOffers: 29,
          canceledOffers: 11,
          averageReplyTime: 1723,
        },
        {
          name: "Madelyn Prosacco IV",
          location: {
            latitude: "24.0066",
            longitude: "-79.8183",
          },
          age: 54,
          acceptedOffers: 75,
          canceledOffers: 45,
          averageReplyTime: 3258,
        },
        {
          name: "Cruz Rolfson",
          location: {
            latitude: "-70.2414",
            longitude: "69.3593",
          },
          age: 52,
          acceptedOffers: 2,
          canceledOffers: 20,
          averageReplyTime: 731,
        },
        {
          name: "Antwon Kreiger",
          location: {
            latitude: "15.9479",
            longitude: "-161.4331",
          },
          age: 49,
          acceptedOffers: 14,
          canceledOffers: 94,
          averageReplyTime: 740,
        },
        {
          name: "Margarete Crooks",
          location: {
            latitude: "31.9103",
            longitude: "-5.6675",
          },
          age: 52,
          acceptedOffers: 7,
          canceledOffers: 34,
          averageReplyTime: 287,
        },
        {
          name: "Bryce Cole",
          location: {
            latitude: "-59.0084",
            longitude: "-25.0715",
          },
          age: 78,
          acceptedOffers: 28,
          canceledOffers: 100,
          averageReplyTime: 2202,
        },
        {
          name: "Demond Herzog",
          location: {
            latitude: "-45.7586",
            longitude: "-12.6758",
          },
          age: 24,
          acceptedOffers: 41,
          canceledOffers: 75,
          averageReplyTime: 223,
        },
        {
          name: "Mrs. Brooks O'Connell",
          location: {
            latitude: "58.5104",
            longitude: "17.8262",
          },
          age: 53,
          acceptedOffers: 0,
          canceledOffers: 11,
          averageReplyTime: 3596,
        },
        {
          name: "Abe Quigley",
          location: {
            latitude: "-49.3177",
            longitude: "-23.1527",
          },
          age: 52,
          acceptedOffers: 5,
          canceledOffers: 15,
          averageReplyTime: 3350,
        },
      ] as Patient[];

      const patientsWithScore = patients.map((x) => {
        const score = Math.random();
        return {
          ...x,
          distance: Math.random() * 100,
          score,
          littleBehaviorScore: score >= 0.2 ? score - 0.2 : 0,
        };
      });

      patientsGetWithScoresSpy.result = patientsWithScore;

      const expectedTop9Scorers = patientsWithScore
        .sort((a, b) => b.score - a.score)
        .slice(0, 9);

      const topList = sut.generate(patients, {
        latitude: "40",
        longitude: "-120",
      });

      expect(topList.slice(0, 9)).toEqual(expectedTop9Scorers);
      expect(topList[9].littleBehaviorScore).toBeLessThan(0.3);
    });

    it("Should try to return 4 patients, two being top scorers and two being due to little behavior but should only return 2 due to lack of little behavior patients", () => {
      const { sut, patientsGetWithScoresSpy } = makeSut();

      const patients = [
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          distance: 1,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
        },
        {
          name: "Michael Scott",
          location: { latitude: "40", longitude: "-130" },
          age: 30,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 120,
        },
        {
          name: "Dwight Kurt Schrute",
          location: { latitude: "40", longitude: "-130" },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Ryan Howard",
          location: { latitude: "40", longitude: "-130" },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Erika Cassin",
          location: {
            latitude: "80.6552",
            longitude: "-100.3033",
          },
          age: 38,
          acceptedOffers: 66,
          canceledOffers: 6,
          averageReplyTime: 1639,
        },
        {
          name: "Malachi Prohaska",
          location: {
            latitude: "-46.2905",
            longitude: "108.2977",
          },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
        {
          name: "Jamie Hermiston",
          location: {
            latitude: "-45.7169",
            longitude: "-129.6572",
          },
          age: 45,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 300,
        },
      ] as Patient[];

      const patientsWithScore = patients.map((x) => ({
        ...x,
        distance: 10,
        score: 1,
        littleBehaviorScore: 0.8,
      }));

      patientsGetWithScoresSpy.result = patientsWithScore;

      const amountOfPatients = 4;
      const littleBehaviorProportion = 2 / amountOfPatients;

      const littleBehaviorScoreEdge = 0.01;

      const topList = sut.generate(
        patients,
        { latitude: "40", longitude: "-120" },
        amountOfPatients,
        littleBehaviorProportion,
        littleBehaviorScoreEdge
      );

      expect(topList.length).toBe(2);
      expect(topList[0].score).toBe(1);
      expect(topList[1].score).toBe(1);
      expect(topList[0].littleBehaviorScore).toBe(0.8);
      expect(topList[1].littleBehaviorScore).toBe(0.8);
    });
  });
});
