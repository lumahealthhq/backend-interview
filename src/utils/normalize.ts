export function normalize(value: number, minValue: number, maxValue: number): number {
    if (maxValue - minValue === 0) {
        return 0;
    }

    return ((value - minValue) / (maxValue - minValue));
}
