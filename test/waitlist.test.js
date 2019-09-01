/* eslint-disable no-undef */
const service = require('../src/waitlist');

const {
  generateImprovedWaitlist
} = service;

test('list with 2 patients with score 10 and 4', async () => {
  const waitlist = [
    {
      id: '213097a3-cae1-48cf-b266-a361a972ff27',
      name: 'Tamara Roberts',
      location: {
        latitude: '68.8129',
        longitude: '71.3018'
      },
      age: 51,
      acceptedOffers: 100,
      canceledOffers: 2,
      averageReplyTime: 87
    },
    {
      id: 'c4dc7b5c-0899-4500-b158-19f535bda9d6',
      name: 'Chester Yost II',
      location: {
        latitude: '-18.8286',
        longitude: '112.3571'
      },
      age: 82,
      acceptedOffers: 75,
      canceledOffers: 58,
      averageReplyTime: 1929
    }
  ];

  const list = await generateImprovedWaitlist(waitlist, 68.8329, 71.2018);
  expect(list[0].score).toBe(10);
  expect(list[1].score).toBe(4);
});

test('list with 3 patients - top of the list a patient with little behavior', async () => {
  const waitlist = [
    {
      id: '213097a3-cae1-48cf-b266-a361a972ff27',
      name: 'Tamara Roberts',
      location: {
        latitude: '68.8129',
        longitude: '71.3018'
      },
      age: 51,
      acceptedOffers: 100,
      canceledOffers: 2,
      averageReplyTime: 87
    },
    {
      id: 'c4dc7b5c-0899-4500-b158-19f535bda9d6',
      name: 'Chester Yost II',
      location: {
        latitude: '-18.8286',
        longitude: '112.3571'
      },
      age: 82,
      acceptedOffers: 75,
      canceledOffers: 58,
      averageReplyTime: 1929
    },
    {
      id: '79526dd8-3926-4e02-b24a-45dcbd5b5dd7',
      name: 'Mrs. Brooks O\'Connell',
      location: {
        latitude: '58.5104',
        longitude: '17.8262'
      },
      age: 53,
      acceptedOffers: 0,
      canceledOffers: 11,
      averageReplyTime: 3596
    }
  ];

  const list = await generateImprovedWaitlist(waitlist, 68.8329, 71.2018);
  expect(list.length).toBe(3);
  expect(list[0].id).toBe('79526dd8-3926-4e02-b24a-45dcbd5b5dd7');
  expect(list[1].score).toBe(10);
  expect(list[2].score).toBe(4);
});
