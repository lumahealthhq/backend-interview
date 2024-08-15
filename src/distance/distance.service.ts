import { Injectable } from '@nestjs/common';
import { Position } from './distance.type';

/**
 *  The haversine formula determines the great-circle distance between two points on a sphere given their longitudes and latitudes.
 *  https://en.wikipedia.org/wiki/Haversine_formula
 */
@Injectable()
export class DistanceService {
  private RADIUS_EARTH = 6371;

  /**
   *
   * @param positionA position A
   * @param positionB position B
   * @returns the distance between position in Km
   */
  public calculateDistance(positionA: Position, positionB: Position) {
    const distanceLat = this.toRad(positionB.latitude - positionA.latitude);
    const distanceLong = this.toRad(positionB.longitude - positionA.longitude);
    const latA = this.toRad(positionA.latitude);
    const latB = this.toRad(positionB.latitude);

    const a =
      Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
      Math.sin(distanceLong / 2) *
        Math.sin(distanceLong / 2) *
        Math.cos(latA) *
        Math.cos(latB);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.RADIUS_EARTH * c;
  }

  private toRad(value: number) {
    return (value * Math.PI) / 180;
  }
}
