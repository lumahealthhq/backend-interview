import { TCoordinates } from '../../types/coordinates';

export function coercePatientCoordinateToNumber(
  latitude: string,
  longitude: string
): TCoordinates {
  return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
}
