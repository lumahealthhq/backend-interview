const { calculateMinMaxValues } = require("./calculate-min-max-values");

describe("calculateMinMax", () => {
  it("Should calculate min and max values for patient fields", () => {
    const maxAge = 50;
    const minAge = 10;
    const maxAcceptedOffers = 40;
    const minAcceptedOffers = 5;
    const maxCanceledOffers = 250;
    const minCanceledOffers = 20;
    const maxAvgReplyTime = 3000;
    const minAvgReplyTime = 100;

    const patients = [
      {
        name: "Samir Pacocha",
        age: maxAge,
        acceptedOffers: maxAcceptedOffers,
        canceledOffers: minCanceledOffers,
        averageReplyTime: 2000,
      },
      {
        name: "Bernard Mosciski",
        age: 20,
        acceptedOffers: 10,
        canceledOffers: maxCanceledOffers,
        averageReplyTime: maxAvgReplyTime,
      },
      {
        name: "Theo Effertz",
        age: minAge,
        canceledOffers: 90,
        acceptedOffers: minAcceptedOffers,
        averageReplyTime: minAvgReplyTime,
      },
    ];

    const { acceptedOffers, age, averageReplyTime, canceledOffers } =
      calculateMinMaxValues(patients);

    expect(age).toEqual({ max: maxAge, min: minAge });
    expect(averageReplyTime).toEqual({
      max: maxAvgReplyTime,
      min: minAvgReplyTime,
    });
    expect(canceledOffers).toEqual({
      max: maxCanceledOffers,
      min: minCanceledOffers,
    });
    expect(acceptedOffers).toEqual({
      max: maxAcceptedOffers,
      min: minAcceptedOffers,
    });
  });
});
