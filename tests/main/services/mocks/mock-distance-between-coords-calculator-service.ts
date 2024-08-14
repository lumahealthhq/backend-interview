import { IDistanceBetweenCoordinatesCalculatorService } from "../../../domain/services";

export class DistanceBetweenCoordinatesCalculatorSpy
  implements IDistanceBetweenCoordinatesCalculatorService
{
  input?: any;
  result?: number;
  calculate(lat1: number, lng1: number, lat2: number, lng2: number): number {
    this.input = { lat1, lng1, lat2, lng2 };

    return this.result || 0;
  }
}
