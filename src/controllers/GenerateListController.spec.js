const GenerateListController = require('./GenerateListController');

const generateListController = new GenerateListController();

const expectedPatients = [
  {
    id: '4bc8fbb0-decb-453a-bc43-9f91722d3c97',
    name: 'Brooke Lemke',
    location: {
      latitude: '-75.3948',
      longitude: '-122.2401',
    },
    age: 62,
    acceptedOffers: 91,
    canceledOffers: 4,
    averageReplyTime: 1074,
    distanceToFacility: 5743316,
    normalizedData: {
      distanceToFacility: 0.7071871280772466,
      age: 0.5942028985507246,
      acceptedOffers: 0.9191919191919192,
      canceledOffers: 0.9591836734693877,
      averageReplyTime: 0.7057006458859871,
    },
    score: '8.35',
    behaviorScore: '2.58',
    demographicScore: '1.30',
  },
  {
    id: 'fbe6232b-db20-44fd-9159-b4c4150321a2',
    name: 'Carmine Balistreri',
    location: {
      latitude: '69.4609',
      longitude: '-32.3907',
    },
    age: 80,
    acceptedOffers: 70,
    canceledOffers: 1,
    averageReplyTime: 379,
    distanceToFacility: 14026653,
    normalizedData: {
      distanceToFacility: 0.28487574975956304,
      age: 0.855072463768116,
      acceptedOffers: 0.7070707070707071,
      canceledOffers: 0.9897959183673469,
      averageReplyTime: 0.9008705419825892,
    },
    score: '8.03',
    behaviorScore: '2.60',
    demographicScore: '1.14',
  },
  {
    id: '15570ee8-522a-4641-8cae-64e72de3dae1',
    name: 'Treva Rau',
    location: {
      latitude: '-60.6299',
      longitude: '160.5845',
    },
    age: 36,
    acceptedOffers: 75,
    canceledOffers: 3,
    averageReplyTime: 272,
    distanceToFacility: 5043911,
    normalizedData: {
      distanceToFacility: 0.7428450627420174,
      age: 0.21739130434782608,
      acceptedOffers: 0.7575757575757576,
      canceledOffers: 0.9693877551020408,
      averageReplyTime: 0.9309182813816343,
    },
    score: '8.00',
    behaviorScore: '2.66',
    demographicScore: '0.96',
  },
  {
    id: '6e7cba0c-5a68-47ff-abdf-316bb32a4638',
    name: 'Ryleigh Green',
    location: {
      latitude: '59.6988',
      longitude: '-77.8355',
    },
    age: 55,
    acceptedOffers: 98,
    canceledOffers: 38,
    averageReplyTime: 186,
    distanceToFacility: 11870256,
    normalizedData: {
      distanceToFacility: 0.3948158607643571,
      age: 0.4927536231884058,
      acceptedOffers: 0.98989898989899,
      canceledOffers: 0.6122448979591837,
      averageReplyTime: 0.955068800898624,
    },
    score: '7.60',
    behaviorScore: '2.56',
    demographicScore: '0.89',
  },
  {
    id: '39e49327-8557-42d8-a016-f4f0a8126a6f',
    name: 'Mathias Will I',
    location: {
      latitude: '-45.7017',
      longitude: '-146.0039',
    },
    age: 52,
    acceptedOffers: 72,
    canceledOffers: 0,
    averageReplyTime: 1827,
    distanceToFacility: 2286735,
    normalizedData: {
      distanceToFacility: 0.883414835144666,
      age: 0.4492753623188406,
      acceptedOffers: 0.7272727272727273,
      canceledOffers: 1,
      averageReplyTime: 0.4942431901151362,
    },
    score: '7.50',
    behaviorScore: '2.22',
    demographicScore: '1.33',
  },
  {
    id: 'ee66c56f-fa5d-4f2d-9cde-63922685f3fd',
    name: 'Christine Funk PhD',
    location: {
      latitude: '-50.6685',
      longitude: '-42.3507',
    },
    age: 46,
    acceptedOffers: 83,
    canceledOffers: 4,
    averageReplyTime: 1435,
    distanceToFacility: 9217771,
    normalizedData: {
      distanceToFacility: 0.5300481465348118,
      age: 0.36231884057971014,
      acceptedOffers: 0.8383838383838383,
      canceledOffers: 0.9591836734693877,
      averageReplyTime: 0.6043246279135075,
    },
    score: '7.49',
    behaviorScore: '2.40',
    demographicScore: '0.89',
  },
  {
    id: 'a1b8dc29-ea95-4851-9426-9c57b6d01573',
    name: 'Shanel Wyman',
    location: {
      latitude: '16.1593',
      longitude: '-39.0140',
    },
    age: 85,
    acceptedOffers: 94,
    canceledOffers: 9,
    averageReplyTime: 2585,
    distanceToFacility: 13380526,
    normalizedData: {
      distanceToFacility: 0.31781739923468033,
      age: 0.927536231884058,
      acceptedOffers: 0.9494949494949495,
      canceledOffers: 0.9081632653061225,
      averageReplyTime: 0.2813816343723673,
    },
    score: '7.38',
    behaviorScore: '2.14',
    demographicScore: '1.25',
  },
  {
    id: '4663ef11-b943-4768-9928-6a5aed8c7bd6',
    name: 'Angel Hermann',
    location: {
      latitude: '20.0546',
      longitude: '38.3639',
    },
    age: 76,
    acceptedOffers: 62,
    canceledOffers: 60,
    averageReplyTime: 3038,
    distanceToFacility: 18480545,
    normalizedData: {
      distanceToFacility: 0.057801894210995575,
      age: 0.7971014492753623,
      acceptedOffers: 0.6262626262626263,
      canceledOffers: 0.3877551020408163,
      averageReplyTime: 0.15417017691659646,
    },
    score: '4.21',
    behaviorScore: '1.17',
    demographicScore: '0.85',
  },
  {
    id: '13369f97-70f2-4545-a832-63e27ff690f5',
    name: 'Luz Larson',
    location: {
      latitude: '83.0637',
      longitude: '-54.6978',
    },
    age: 72,
    acceptedOffers: 9,
    canceledOffers: 79,
    averageReplyTime: 1233,
    distanceToFacility: 13086233,
    normalizedData: {
      distanceToFacility: 0.33282141059619397,
      age: 0.7391304347826086,
      acceptedOffers: 0.09090909090909091,
      canceledOffers: 0.19387755102040816,
      averageReplyTime: 0.6610502667789947,
    },
    score: '3.25',
    behaviorScore: '0.95',
    demographicScore: '1.07',
  },
  {
    id: '00a14491-75b8-461b-af92-d663ca97d24f',
    name: 'Marge Bayer DVM',
    location: {
      latitude: '-36.9629',
      longitude: '-71.6862',
    },
    age: 54,
    acceptedOffers: 33,
    canceledOffers: 53,
    averageReplyTime: 3346,
    distanceToFacility: 7741136,
    normalizedData: {
      distanceToFacility: 0.6053317867056913,
      age: 0.4782608695652174,
      acceptedOffers: 0.3333333333333333,
      canceledOffers: 0.45918367346938777,
      averageReplyTime: 0.06767761864644763,
    },
    score: '3.60',
    behaviorScore: '0.86',
    demographicScore: '1.08',
  },
];

describe('GenerateListController', () => {
  it('should return a valid list with 10 patients, given a facility location', () => {
    const patientList = generateListController.index({
      lat: '-26.5030',
      long: '-155.1633',
    });

    expect(patientList.length).toBe(10);

    // Since 3 of the patients are randomly selected, we can only assert 7 of the patients
    for (let i = 0; i < 7; i += 1) {
      expect(patientList[i]).toEqual(expectedPatients[i]);
    }
  });
});
