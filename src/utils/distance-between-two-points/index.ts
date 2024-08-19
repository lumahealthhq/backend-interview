import { TCoordinates } from '../../types/coordinates';

export function distanceBetweenTwoPoints(
  pointA: TCoordinates,
  pointB: TCoordinates
): number {
  const xDiff = (pointB.latitude - pointA.latitude) ** 2;
  const yDiff = (pointB.longitude - pointA.longitude) ** 2;

  const distance = Math.sqrt(xDiff + yDiff);

  return distance;
}
