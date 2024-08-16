export type Coordinate = {
    lat: number;
    lon: number;
};

// https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
export function haversineDistanceBetweenPoints(from: Coordinate, to: Coordinate) {
    const R = 6371e3;
    const p1 = from.lat * Math.PI / 180;
    const p2 = to.lat * Math.PI / 180;
    const deltaLon = to.lon - from.lon;
    const deltaLambda = (deltaLon * Math.PI) / 180;
    return Math.acos(
        Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda),
    ) * R;
}
