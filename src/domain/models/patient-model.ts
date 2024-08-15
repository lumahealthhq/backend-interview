import { LocationCoords } from "@/domain/protocols";

export interface Patient {
  id: string;
  name: string;
  location: LocationCoords;
  age: number;
  score?: number;
  littleBehaviorScore?: number;
  distance?: number;
  distancePenalty?: number;
  acceptedOffers: number;
  canceledOffers: number;
  averageReplyTime: number;
}
