interface LocationCoords {
  latitude: string;
  longitude: string;
}

type FacilityLocation = LocationCoords;
type PatientLocation = LocationCoords;

interface MinMax {
  min: number;
  max: number;
}

interface MinMaxPatientValues {
  age: MinMax;
  acceptedOffers: MinMax;
  canceledOffers: MinMax;
  averageReplyTime: MinMax;
}

interface Patient {
  id: string;
  name: string;
  location: PatientLocation;
  age: number;
  score?: number;
  littleBehaviorScore?: number;
  distance?: number;
  acceptedOffers: number;
  canceledOffers: number;
  averageReplyTime: number;
}
