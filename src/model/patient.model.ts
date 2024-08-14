import {
  IsDefined, IsNumber, IsString, IsUUID, ValidateNested,
  validateSync,
} from 'class-validator';
import {InvalidPatientException} from '../exceptions/invalid-patient.exception';
import {LocationModel} from './location.model';

export class PatientModel {
  @IsDefined()
  @IsUUID() id: string;

  @IsDefined()
  @IsString() name: string;

  @IsDefined()
  @ValidateNested() location: LocationModel;

  @IsDefined()
  @IsNumber() age: number;

  @IsDefined()
  @IsNumber() acceptedOffers: number;

  @IsDefined()
  @IsNumber() canceledOffers: number;

  @IsDefined()
  @IsNumber() averageReplyTime: number;

  constructor(data: PatientModel) {
    this.id = data.id;
    this.name = data.name;
    this.location = new LocationModel(data.location);
    this.age = data.age;
    this.acceptedOffers = data.acceptedOffers;
    this.canceledOffers = data.canceledOffers;
    this.averageReplyTime = data.averageReplyTime;

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new InvalidPatientException(errors);
    }
  }
}
