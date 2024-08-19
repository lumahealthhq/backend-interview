interface Patient {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  age: number;
  acceptedOffers: number;
  canceledOffers: number;
  averageReplyTime: number;
}

export default Patient
