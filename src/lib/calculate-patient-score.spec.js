const { calculatePatientScore } = require("./calculate-patient-score");

describe("calculatePatientScore", () => {
  describe("Calculates a score from 0 to 1 based on field normalization and weight", () => {
    it("Should return a perfect score", () => {
      const patient = {
        id: "1",
        name: "Michael Scott",
        location: {
          // * really close to the office
          latitude: "-81.08",
          longitude: "144.08",
        },
        age: 16,
        acceptedOffers: 95,
        canceledOffers: 20,
        averageReplyTime: 100,
      };

      const officeCoords = {
        latitude: "-81.09",
        longitude: "144.09",
      };

      const result = calculatePatientScore(patient, officeCoords, {
        age: { max: 50, min: 10 },
        acceptedOffers: { max: 95, min: 5 },
        canceledOffers: { max: 250, min: 20 },
        averageReplyTime: { max: 3000, min: 100 },
      });

      expect(result).toBeCloseTo(1, 0);
    });

    it("Should return a terrible score", () => {
      const patient = {
        id: "1",
        name: "Dwight Kurt Schrute",
        location: {
          // * extremely way from the office
          latitude: "81.08",
          longitude: "-144.08",
        },
        // oldest
        age: 50,
        // lowest amount of accepted offers
        acceptedOffers: 5,
        // highest amount of canceled offers
        canceledOffers: 250,
        // takes longer to reply
        averageReplyTime: 3000,
      };

      const officeCoords = {
        latitude: "81.09",
        longitude: "144.09",
      };

      const result = calculatePatientScore(patient, officeCoords, {
        age: { max: 50, min: 10 },
        acceptedOffers: { max: 95, min: 5 },
        canceledOffers: { max: 250, min: 20 },
        averageReplyTime: { max: 3000, min: 100 },
      });

      expect(result).toBeCloseTo(0, 0);
    });

    it("Should return a mediocre score", () => {
      const patient = {
        id: "1",
        name: "Dwight Kurt Schrute",
        // 50km distance to office
        location: {
          latitude: "80.64",
          longitude: "144.08",
        },
        // average on everything
        age: 30,
        acceptedOffers: 50,
        canceledOffers: 135,
        averageReplyTime: 1550,
      };

      const officeCoords = {
        latitude: "81.09",
        longitude: "144.09",
      };

      const result = calculatePatientScore(patient, officeCoords, {
        age: { max: 50, min: 10 },
        acceptedOffers: { max: 95, min: 5 },
        canceledOffers: { max: 250, min: 20 },
        averageReplyTime: { max: 3000, min: 100 },
      });

      expect(result).toBeCloseTo(0.5, 0);
    });
  });
});
