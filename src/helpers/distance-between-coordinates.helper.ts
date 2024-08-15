import {type LocationModel} from '../models/location.model';

/**
 * We could use something like Haversine formula to calculate the distance between the two points, but is almost
 * impossible for a patient to be too far from a facility at the point that this formula is necessary.
 *
 * So, the simplest way to calculate the distance between two points should be using the distance formula.
 * Reference: https://www.wikihow.com/Find-the-Distance-Between-Two-Points
 *
 * @param locationA
 * @param locationB
 * @returns
 */
export function distanceBetweenCoordinates(locationA: LocationModel, locationB: LocationModel): number {
  const y1 = Number(locationA.latitude);
  const y2 = Number(locationB.latitude);
  const x1 = Number(locationA.longitude);
  const x2 = Number(locationB.longitude);

  return Math.hypot((x2 - x1), (y2 - y1));
}
