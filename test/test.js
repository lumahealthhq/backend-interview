const { practiceLocation, patientDefaults } = require('./data');
const { testOrder } = require('./lib');

describe('generated call list priority', () => {
  it('should negatively correlate with distance', () => {
    testOrder([
      {
        location: {
          latitude: practiceLocation.latitude,
          longitude: practiceLocation.longitude,
        },
      },
      {
        location: {
          latitude: practiceLocation.latitude,
          longitude: practiceLocation.longitude + 1,
        },
      },
      {
        location: {
          latitude: practiceLocation.latitude,
          longitude: practiceLocation.longitude + 2,
        },
      },
    ]);
  });

  it('should negatively correlate with age', () => {
    testOrder([
      { age: patientDefaults.age },
      { age: patientDefaults.age + 1 },
      { age: patientDefaults.age + 2 },
    ]);
  });

  // Canceled offers are modified to avoid random padding of accepted offers
  it('should positively correlate with acceptedOffers', () => {
    testOrder([
      {
        acceptedOffers: patientDefaults.acceptedOffers + 2,
        canceledOffers: patientDefaults.canceledOffers - 2,
      },
      {
        acceptedOffers: patientDefaults.acceptedOffers + 1,
        canceledOffers: patientDefaults.canceledOffers - 1,
      },
      { acceptedOffers: patientDefaults.acceptedOffers },
    ]);
  });

  // Accepted offers are modified to avoid random padding of accepted offers
  it('should negatively correlate with canceledOffers', () => {
    testOrder([
      { canceledOffers: patientDefaults.canceledOffers },
      {
        canceledOffers: patientDefaults.canceledOffers + 1,
        acceptedOffers: patientDefaults.acceptedOffers - 1,
      },
      {
        canceledOffers: patientDefaults.canceledOffers + 2,
        acceptedOffers: patientDefaults.acceptedOffers - 2,
      },
    ]);
  });

  it('should negatively correlate with averageReplyTime', () => {
    testOrder([
      { averageReplyTime: patientDefaults.averageReplyTime },
      { averageReplyTime: patientDefaults.averageReplyTime + 1 },
      { averageReplyTime: patientDefaults.averageReplyTime + 2 },
    ]);
  });
});
