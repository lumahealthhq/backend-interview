import Patient from "./patient";

export interface ScoredPatient extends Patient {
  ageScore: number;
  offersScore: number;
  replyTimeScore: number;
  lowDataBonus: number;
  locationScore?: number;
  score?: number;
}
