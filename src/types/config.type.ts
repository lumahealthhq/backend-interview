export type WeightParameter = {
  percentage: number;
  correlation: number;
};

export type WeightParameterConfig = {
  age: WeightParameter;
  distanceToFacility: WeightParameter;
  acceptedOffers: WeightParameter;
  canceledOffers: WeightParameter;
  averageReplyTime: WeightParameter;
};
