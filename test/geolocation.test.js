/* eslint-disable no-undef */
const geolocationUtils = require('../src/utils/geolocation.utils');
const mathUtils = require('../src/utils/math.utils');

const { calculateDistanceBetweenLocations } = geolocationUtils;
const { fixDecimals } = mathUtils;

test('calc distance with 1.0926553377161752km distance', () => {
  const location1 = {
    latitude: 41.1594746,
    longitude: -8.6373598
  };
  const location2 = {
    latitude: 41.1572154,
    longitude: -8.6246578
  };

  const distance = calculateDistanceBetweenLocations(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );

  expect(distance).toBe(1.0926553377161752);
});

test('calc distance with 1.0926553377161752km distance - reversing locations', () => {
  const location1 = {
    latitude: 41.1594746,
    longitude: -8.6373598
  };
  const location2 = {
    latitude: 41.1572154,
    longitude: -8.6246578
  };

  const distance = calculateDistanceBetweenLocations(
    location2.latitude,
    location2.longitude,
    location1.latitude,
    location1.longitude
  );

  expect(distance).toBe(1.0926553377161752);
});

test('calc distance with positive and negative longitude values', () => {
  const location1 = {
    latitude: 41.1594746,
    longitude: -8.6373598
  };
  const location2 = {
    latitude: 48.8583701,
    longitude: 2.2944813
  };

  const distance = calculateDistanceBetweenLocations(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );

  // 1,210.73 km
  const fixedDistance = fixDecimals(distance, 2);
  expect(fixedDistance).toBe(1210.73);
});

test('calc distance with positive and negative longitude values - reversing locations', () => {
  const location1 = {
    latitude: 41.1594746,
    longitude: -8.6373598
  };
  const location2 = {
    latitude: 48.8583701,
    longitude: 2.2944813
  };

  const distance = calculateDistanceBetweenLocations(
    location2.latitude,
    location2.longitude,
    location1.latitude,
    location1.longitude
  );

  // 1,210.73 km
  const fixedDistance = fixDecimals(distance, 2);
  expect(fixedDistance).toBe(1210.73);
});

test('calc distance less than 1km', () => {
  const location1 = {
    latitude: 41.1594746,
    longitude: -8.6373598
  };
  const location2 = {
    latitude: 41.15883,
    longitude: -8.6336808
  };

  const distance = calculateDistanceBetweenLocations(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );

  const distanceFixed2Decimals = fixDecimals(distance, 2);
  expect(distanceFixed2Decimals).toBe(0.32);

  const distanceFixedNoDecimals = fixDecimals(distance, 0);
  expect(distanceFixedNoDecimals).toBe(0);
});
