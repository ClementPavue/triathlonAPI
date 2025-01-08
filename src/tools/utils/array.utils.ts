export async function asyncMap<T, U>(
    array: Array<T>,
    callbackfn: (value: T, index: number, innerArray: T[]) => Promise<U>,
    parallelized = false
): Promise<U[]> {
    if (parallelized) {
        return Promise.all(array.map(callbackfn));
    }
    const newArray = new Array<U>();
    const arrayEntriesIterator = array.entries();
    for (const [index, value] of arrayEntriesIterator) {
        newArray[index] = await callbackfn(value, index, array);
    }
    return newArray;
}

export async function asyncForEach<T>(
    array: Array<T>,
    callbackfn: (value: T, index: number, innerArray: T[]) => Promise<void>,
    parallelized = false
): Promise<void> {
    if (parallelized) {
        await Promise.all(array.map(callbackfn));
    } else {
        const arrayEntriesIterator = array.entries();
        for (const [index, value] of arrayEntriesIterator) {
            await callbackfn(value, index, array);
        }
    }
}

export async function asyncReduce<T, U>(
    array: Array<T>,
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, innerArray: T[]) => Promise<U>,
    initialValue: U
): Promise<U> {
    const arrayEntriesIterator = array.entries();
    for (const [index, value] of arrayEntriesIterator) {
        initialValue = await callbackfn(initialValue, value, index, array);
    }
    return initialValue;
}

export async function asyncFind<T>(
    array: Array<T>,
    callbackfn: (value: T, index: number, innerArray: T[]) => Promise<boolean>
): Promise<T | undefined> {
    const arrayEntriesIterator = array.entries();
    for (const [index, value] of arrayEntriesIterator) {
        if (await callbackfn(value, index, array)) {
            return value;
        }
    }
    return undefined;
}
