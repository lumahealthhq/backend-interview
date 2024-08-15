export interface IDistanceBetweenCoordinatesCalculatorService {
  calculate(lat1: number, lng1: number, lat2: number, lng2: number): number;
}
