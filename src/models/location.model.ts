import {
  IsDefined, IsLatitude, IsLongitude, validateSync,
} from 'class-validator';
import {InvalidLocationException} from '../exceptions/invalid-location.exception';

export class LocationModel {
  @IsDefined()
  @IsLatitude()
  public latitude: string;

  @IsDefined()
  @IsLongitude()
  public longitude: string;

  constructor(data: LocationModel) {
    this.latitude = data.latitude;
    this.longitude = data.longitude;

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new InvalidLocationException(errors);
    }
  }
}
