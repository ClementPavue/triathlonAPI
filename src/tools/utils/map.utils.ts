export function mapMerge<K, T>(...maps: Array<Map<K, T>>): Map<K, T> {
    return maps.reduce((acc, map) => {
        for (const [key, value] of map) {
            acc.set(key, value);
        }
        return acc;
    }, new Map<K, T>());
}

export function mapConcat<K, T>(...maps: Array<Map<K, T>>): Map<K, T[]> {
    return maps.reduce((acc, map) => {
        for (const [key, value] of map) {
            acc.set(key, acc.has(key) ? acc.get(key).concat(value) : [value]);
        }
        return acc;
    }, new Map<K, T[]>());
}
