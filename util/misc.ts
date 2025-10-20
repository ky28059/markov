export function getMinMax(arr: number[]): [number, number] {
    return arr.reduce(
        ([min, max], a) => [Math.min(min, a), Math.max(max, a)],
        [Infinity, -Infinity]
    );
}

export function chunked<T>(arr: T[], size: number) {
    return arr.reduce((res: T[][], item, index) => {
        const chunkIndex = Math.floor(index / size);
        if (!res[chunkIndex]) res[chunkIndex] = [];

        res[chunkIndex].push(item);
        return res;
    }, []);
}
