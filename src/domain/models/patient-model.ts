import { LocationCoords } from "../protocols";

export interface Patient {
  id: string;
  name: string;
  location: LocationCoords;
  age: number;
  score?: number;
  littleBehaviorScore?: number;
  distance?: number;
  acceptedOffers: number;
  canceledOffers: number;
  averageReplyTime: number;
}
