export type Coordinate = {
    latitude: number | string;
    longitude: number | string;
};

// https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
export function haversineDistanceBetweenPoints(from: Coordinate, to: Coordinate) {
    from.latitude = typeof from.latitude === 'string' ? parseFloat(from.latitude) : from.latitude;
    from.longitude = typeof from.longitude === 'string' ? parseFloat(from.longitude) : from.longitude;
    to.latitude = typeof to.latitude === 'string' ? parseFloat(to.latitude) : to.latitude;
    to.longitude = typeof to.longitude === 'string' ? parseFloat(to.longitude) : to.longitude;

    const R = 6371e3;
    const p1 = from.latitude * Math.PI / 180;
    const p2 = to.latitude * Math.PI / 180;
    const deltaLon = to.longitude - from.longitude;
    const deltaLambda = (deltaLon * Math.PI) / 180;

    return Math.acos(
        Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda),
    ) * R;
}
