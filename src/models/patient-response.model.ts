import {
  IsDefined, IsNumber, IsString, IsUUID, Max, Min, ValidateNested,
  validateSync,
} from 'class-validator';
import {InvalidPatientException} from '../exceptions/invalid-patient.exception';
import {LocationModel} from './location.model';

export class PatientResponseModel {
  @IsDefined()
  @IsUUID() id: string;

  @IsDefined()
  @IsString() name: string;

  @IsDefined()
  @ValidateNested() location: LocationModel;

  @IsDefined()
  @Min(0)
  @Max(122) //  https://en.wikipedia.org/wiki/List_of_the_verified_oldest_people
  @IsNumber() age: number;

  @IsDefined()
  @Min(0)
  @IsNumber() acceptedOffers: number;

  @IsDefined()
  @Min(0)
  @IsNumber() canceledOffers: number;

  @IsDefined()
  @Min(0)
  @IsNumber() averageReplyTime: number;

  @IsDefined()
  @Min(1)
  @Max(10)
  @IsNumber() score?: number;

  constructor(data: PatientResponseModel) {
    this.id = data.id;
    this.name = data.name;
    this.location = new LocationModel(data.location);
    this.age = data.age;
    this.acceptedOffers = data.acceptedOffers;
    this.canceledOffers = data.canceledOffers;
    this.averageReplyTime = data.averageReplyTime;
    this.score = data.score;

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new InvalidPatientException(errors);
    }
  }
}
