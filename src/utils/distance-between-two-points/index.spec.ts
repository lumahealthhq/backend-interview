import { distanceBetweenTwoPoints } from '.';

describe('Distance between two points', () => {
  it('should return the correct distance between two points', () => {
    const pointA = { longitude: 1, latitude: 2 };
    const pointB = { longitude: 5, latitude: 6 };

    const result = distanceBetweenTwoPoints(pointA, pointB);

    expect(result).toBeCloseTo(5.6568);
  });
});
