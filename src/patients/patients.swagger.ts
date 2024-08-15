import { ApiResponseProperty } from '@nestjs/swagger';

class LocationSchema {
  @ApiResponseProperty()
  latitude: string;
  @ApiResponseProperty()
  longitude: string;
}

export class PatientSchema {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  location: LocationSchema;
  @ApiResponseProperty()
  age: number;
  @ApiResponseProperty()
  acceptedOffers: number;
  @ApiResponseProperty()
  canceledOffers: number;
  @ApiResponseProperty()
  averageReplyTime: number;
}
