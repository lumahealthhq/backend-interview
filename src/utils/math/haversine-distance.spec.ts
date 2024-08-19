import haversineDistance from './haversine-distance';

describe('haversineDistance', () => {
  test('calculates distance between two points on Earth', () => {
    // New York City coordinates
    const lat1 = 40.7128;
    const lon1 = -74.0060;

    // Los Angeles coordinates
    const lat2 = 34.0522;
    const lon2 = -118.2437;

    const distance = haversineDistance(lat1, lon1, lat2, lon2);

    // The expected distance is approximately 2451 miles
    expect(distance).toBeCloseTo(2451, -2);
  });

  test('returns 0 for the same point', () => {
    const lat = 51.5074;
    const lon = -0.1278;

    const distance = haversineDistance(lat, lon, lat, lon);

    expect(distance).toBe(0);
  });

  test('calculates distance for points on opposite sides of the Earth', () => {
    // London coordinates
    const lat1 = 51.5074;
    const lon1 = -0.1278;

    // Wellington (New Zealand) coordinates (approximately antipodal to London)
    const lat2 = -41.2865;
    const lon2 = 174.7762;

    const distance = haversineDistance(lat1, lon1, lat2, lon2);

    // The expected distance is approximately 12450 miles (half the Earth's circumference)
    expect(distance).toBeCloseTo(12450, -4);
  });

  test('handles negative latitudes and longitudes', () => {
    // Buenos Aires coordinates
    const lat1 = -34.6037;
    const lon1 = -58.3816;

    // Cape Town coordinates
    const lat2 = -33.9249;
    const lon2 = 18.4241;

    const distance = haversineDistance(lat1, lon1, lat2, lon2);

    // The expected distance is approximately 4633 miles
    expect(distance).toBeCloseTo(4633, -3);
  });
});
