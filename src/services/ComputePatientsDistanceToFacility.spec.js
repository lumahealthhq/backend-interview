const ComputePatientsDistanceToFacilityService = require('./ComputePatientsDistanceToFacilityService');

const computePatientsDistanceToFacility = new ComputePatientsDistanceToFacilityService();

const TEST_DATA = [
  {
    id: '6b392ca6-194a-4873-948a-526fe2d8cc3a',
    name: 'Marlee Braun',
    location: {
      latitude: '43.3205',
      longitude: '-140.8269',
    },
    age: 72,
    acceptedOffers: 87,
    canceledOffers: 87,
    averageReplyTime: 2675,
  },
  {
    id: 'e074c2e9-06ea-4c35-a78d-86d293128835',
    name: 'Giovanna Jast',
    location: {
      latitude: '67.3767',
      longitude: '3.5119',
    },
    age: 82,
    acceptedOffers: 79,
    canceledOffers: 25,
    averageReplyTime: 3071,
  },
  {
    id: '8115b788-88dd-476e-9ebe-10609a6684c4',
    name: 'Rudy Quitzon',
    location: {
      latitude: '-26.5030',
      longitude: '-155.1633',
    },
    age: 87,
    acceptedOffers: 9,
    canceledOffers: 52,
    averageReplyTime: 1608,
  },
];

const FACILITY_LOCATION = {
  latitude: '-26.5030',
  longitude: '-155.1633',
};

let patientsWithDistance;

describe('ComputePatientsDistanceToFacility', () => {
  beforeEach(() => {
    patientsWithDistance = computePatientsDistanceToFacility.execute(
      FACILITY_LOCATION,
      TEST_DATA,
    );
  });

  it('should calculate the distance between a given facility location and a patient and return a valid number', () => {
    patientsWithDistance.forEach(patient => {
      expect(patient).toHaveProperty('distanceToFacility');
      expect(patient.distanceToFacility).not.toBeNull();
      expect(patient.distanceToFacility).not.toBeNaN();
      expect(typeof patient.distanceToFacility).toBe('number');
    });
  });

  it('should return the distance of zero when a patient has the same location as a facility', () => {
    expect(patientsWithDistance[2].distanceToFacility).toBe(0);
  });
});
