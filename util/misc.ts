export function getMinMax(arr: number[]): [number, number] {
    return arr.reduce(
        ([min, max], a) => [Math.min(min, a), Math.max(max, a)],
        [Infinity, -Infinity]
    );
}
