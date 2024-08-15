import type { IDistanceBetweenCoordinatesCalculatorService } from "@/domain/services";

export class DistanceBetweenCoordinatesCalculatorService
  implements IDistanceBetweenCoordinatesCalculatorService
{
  /**
   * Given two coordinates that represent points in the globe, calculates the shortest distance (in kilometers) over the earth’s surface.
   *
   * @link https://www.movable-type.co.uk/scripts/latlong.html
   *
   * @returns Distance between coordinates in KM
   */
  calculate(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRadians = (degree: number) => (Number(degree) * Math.PI) / 180;

    const R = 6371; // Earth Radius in KM

    /*
     ? a = sin²(dLat/2) + cos(lat1Rad) * cos(lat2Rad) * sin²(dLon/2)
     ? c = 2 * atan2(√a, √(1−a))
     ? d = R * c
     */

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const dLatRad = toRadians(lat2 - lat1);
    const dLonRad = toRadians(lng2 - lng1);

    const a =
      Math.pow(Math.sin(dLatRad / 2), 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.pow(Math.sin(dLonRad / 2), 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
