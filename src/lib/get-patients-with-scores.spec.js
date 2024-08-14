const { getPatientsWithScores } = require("./get-patients-with-scores");

describe("getPatientsWithScores", () => {
  it("Should return patients with scores", () => {
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

    const facilityCoords = { latitude: "40", longitude: "-120" };

    const result = getPatientsWithScores(patients, facilityCoords);

    expect(result).toEqual([
      {
        ...patients[0],
        distance: 851.3551260515738,
        littleBehaviorScore: 0.5,
        score: 0.6,
      },
      {
        ...patients[1],
        distance: 851.3551260515738,
        littleBehaviorScore: 0.3,
        score: 0.3,
      },
    ]);
  });

  it("Should return medium score if there is only one patient", () => {
    const patients = [
      {
        location: { latitude: "40", longitude: "-119.48" },
        age: 45,
        acceptedOffers: 5,
        canceledOffers: 2,
        averageReplyTime: 300,
      },
    ];

    const facilityCoords = { latitude: "40", longitude: "-120" };

    const result = getPatientsWithScores(patients, facilityCoords);

    expect(result).toEqual([
      {
        ...patients[0],
        distance: 44.293670132641076,
        littleBehaviorScore: 0.4,
        score: 0.505706329867359,
      },
    ]);
  });
});
