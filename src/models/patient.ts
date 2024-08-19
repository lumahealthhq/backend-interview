export interface Location {
    latitude: number;
    longitude: number;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    location: Location;
    acceptedOffers: number;
    canceledOffers: number;
    averageReplyTime: number;
    score?: number;
    distance : number;
}

export interface PatientDatasetValues {
    age: MinMaxValues;
    distance: MinMaxValues;
    acceptedOffers: MinMaxValues;
    canceledOffers: MinMaxValues;
    replyTime: MinMaxValues;
}

export interface MinMaxValues {
    min: number;
    max: number;
}