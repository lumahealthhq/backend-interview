const GetPatientsTopList = require("../../src/lib/get-patients-top-list");

describe("getPatientsTopList", () => {
  describe("sortByScore", () => {
    it("Should return items sorted by score DESC (highest to lowest)", () => {
      const items = [
        { score: 30 },
        { score: -1 },
        { score: 1 },
        { score: 1 },
        { score: 30 },
        { score: -10 },
        { score: 20 },
      ];

      const sortedItems = GetPatientsTopList.sortByScore(items);

      expect(sortedItems).toStrictEqual([
        { score: 30 },
        { score: 30 },
        { score: 20 },
        { score: 1 },
        { score: 1 },
        { score: -1 },
        { score: -10 },
      ]);
    });
  });

  describe("filterLittleBehavior", () => {
    it("Should return only items that have littleBehaviorScore smaller or equal than littleBehaviorScoreEdge", () => {
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

      const itemsFiltered = GetPatientsTopList.filterLittleBehavior(
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
      const items = [
        { littleBehaviorScore: 0.4 },
        { littleBehaviorScore: 0.35 },
        { littleBehaviorScore: 0.3 },
        { littleBehaviorScore: 0.2 },
        { littleBehaviorScore: 0.1 },
        { littleBehaviorScore: 0 },
      ];

      const itemsFiltered = GetPatientsTopList.filterLittleBehavior(items);

      expect(itemsFiltered).toEqual([
        { littleBehaviorScore: 0.3 },
        { littleBehaviorScore: 0.2 },
        { littleBehaviorScore: 0.1 },
        { littleBehaviorScore: 0 },
      ]);
    });
  });

  describe("getPatientsTopList", () => {
    xit("Should call sortByScore with correct params", () => {
      const patients = [
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          distance: 851.3551260515738,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
          score: 0.7999999999999999,
          littleBehaviorScore: 0.7,
        },
        {
          name: "Erika Cassin",
          location: { latitude: "80.6552", longitude: "-100.3033" },
          age: 38,
          acceptedOffers: 66,
          canceledOffers: 6,
          averageReplyTime: 1639,
          score: 0.6451012527055062,
          distance: 4591.366006792284,
          littleBehaviorScore: 0.5756568082610618,
        },
      ];

      const sortByPriceSpy = jest.spyOn(GetPatientsTopList, "sortByScore");

      getPatientsWithScores.mockReturnValue(patients);

      const facilityCoordinates = {
        latitude: "40",
        longitude: "-120",
      };

      const amountToSelectFromTopScore = 2;

      GetPatientsTopList.getPatientsTopList(
        patients,
        facilityCoordinates,
        amountToSelectFromTopScore
      );

      expect(sortByPriceSpy).toHaveBeenCalled();
      expect(sortByPriceSpy).toHaveBeenCalledWith(patients);
    });

    xit("Should call filterLittleBehavior with correct params", () => {
      const patients = [
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          distance: 851.3551260515738,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
          score: 0.7999999999999999,
          littleBehaviorScore: 0.7,
        },
        {
          name: "Erika Cassin",
          location: { latitude: "80.6552", longitude: "-100.3033" },
          age: 38,
          acceptedOffers: 66,
          canceledOffers: 6,
          averageReplyTime: 1639,
          score: 0.6451012527055062,
          distance: 4591.366006792284,
          littleBehaviorScore: 0.5756568082610618,
        },
      ];

      getPatientsWithScores.mockReturnValue(patients);

      const filterLittleBehaviorSpy = jest.spyOn(
        GetPatientsTopList,
        "filterLittleBehavior"
      );

      const facilityCoordinates = {
        latitude: "40",
        longitude: "-120",
      };

      const amountToSelectFromTopScore = 1;

      GetPatientsTopList.getPatientsTopList(
        patients,
        facilityCoordinates,
        amountToSelectFromTopScore
      );

      expect(filterLittleBehaviorSpy).toHaveBeenCalled();
      expect(filterLittleBehaviorSpy).toHaveBeenCalledWith(patients[1]);
    });

    it("Should return 4 patients, two being top scorers and two with little behavior", () => {
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
      ];

      const facilityCoordinates = {
        latitude: "40",
        longitude: "-120",
      };

      const amountOfPatients = 4;
      const littleBehaviorProportion = 2 / amountOfPatients;

      const littleBehaviorScoreEdge = 0.3;

      const topList = GetPatientsTopList.getPatientsTopList(
        patients,
        facilityCoordinates,
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

    it("Should default 'amountToSelectFromTopScore' to 9 and return 10 patients, where 9 are top scorers and 1 is due to little behavior", () => {
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
      ];

      const facilityCoordinates = {
        latitude: "40",
        longitude: "-120",
      };

      const topList = GetPatientsTopList.getPatientsTopList(
        patients,
        facilityCoordinates
      );

      expect(topList.length).toBe(10);
    });

    it("Should try to return 4 patients, two being top scorers and two being due to little behavior but should only return 2 due to lack of little behavior patients", () => {
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
      ];

      const facilityCoordinates = {
        latitude: "40",
        longitude: "-120",
      };

      const amountOfPatients = 4;
      const littleBehaviorProportion = 2 / amountOfPatients;

      const littleBehaviorScoreEdge = 0.01;

      const topList = GetPatientsTopList.getPatientsTopList(
        patients,
        facilityCoordinates,
        amountOfPatients,
        littleBehaviorProportion,
        littleBehaviorScoreEdge
      );

      expect(topList).toStrictEqual([
        {
          name: "Jim Halpert",
          location: { latitude: "40", longitude: "-130" },
          distance: 851.3551260515738,
          age: 16,
          acceptedOffers: 95,
          canceledOffers: 20,
          averageReplyTime: 100,
          score: 0.6,
          littleBehaviorScore: 0.5,
        },
        {
          name: "Michael Scott",
          location: { latitude: "40", longitude: "-130" },
          age: 30,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 120,
          score: 0.5491250476126459,
          distance: 851.3551260515738,
          littleBehaviorScore: 0.49740090968161144,
        },
      ]);
    });
  });
});
