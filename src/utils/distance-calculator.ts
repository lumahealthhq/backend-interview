const R = 6371; // Earth radius in kilometers

export function distanceBetweenTwoPoints(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

