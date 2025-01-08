export function iteratorMap<T, U>(iterator: IterableIterator<T>, callbackfn: (value: T, index: number, array: T[]) => U): U[] {
    const args = new Array<T>();
    const res = new Array<U>();
    let index = 0;
    for (const val of iterator) {
        args.push(val);
        res.push(callbackfn(val, index++, args));
    }
    return res;
}

export function iteratorForEach<T>(
    iterator: IterableIterator<T>,
    callbackfn: (value: T, index: number, array: T[]) => void
): void {
    const args = new Array<T>();
    let index = 0;
    for (const val of iterator) {
        args.push(val);
        callbackfn(val, index++, args);
    }
}

export function iteratorReduce<T, U>(
    iterator: IterableIterator<T>,
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U
): U {
    const args = new Array<T>();
    let acc = initialValue;
    let index = 0;
    for (const val of iterator) {
        args.push(val);
        acc = callbackfn(acc, val, index++, args);
    }
    return acc;
}
