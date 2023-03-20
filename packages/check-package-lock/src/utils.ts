export function isNonNullable<T>(val: T): val is NonNullable<T> {
    return val !== null && val !== undefined;
}

export function onlyUnique<T>(value: T, index: number, array: T[]) {
    return array.indexOf(value) === index;
}
