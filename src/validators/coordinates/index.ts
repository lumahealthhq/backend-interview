import { TCoordinates, coordinatesSchema } from '../../types/coordinates';

export function validateCoordinate(
  latitude: TCoordinates['latitude'],
  longitude: TCoordinates['longitude']
): boolean {
  const { success } = coordinatesSchema.safeParse({ longitude, latitude });

  if (!success) {
    return false;
  }

  return true;
}
