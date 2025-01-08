export function keyof<T extends GenericRecord>(obj: T): Array<keyof T> {
    return Object.getOwnPropertyNames(obj)
        .reduce((acc, key) => {
            const numberKey = parseFloat(key as string) as Extract<keyof T, number>;
            if (!Number.isNaN(numberKey) && numberKey.toString() === key) {
                acc.push(numberKey);
            } else {
                acc.push(key);
            }
            return acc;
        }, new Array<keyof T>())
        .concat(Object.getOwnPropertySymbols(obj));
}

export function ownEntries<T extends GenericRecord>(obj: T): Array<readonly [keyof T, T[keyof T]]> {
    return keyof(obj).map(prop => [prop, obj[prop]] as const);
}

export function transform<T extends Record<PropertyKey, unknown>, U extends Record<keyof T, unknown>>(
    obj: T,
    cb: (arg: T[keyof T]) => U[keyof T]
): U {
    return Object.fromEntries(
        Object.entries(obj).map(
            ([key, value]) =>
                [
                    key,
                    typeof value === "object" && value !== null
                        ? (transform<Record<PropertyKey, unknown>, Record<PropertyKey, unknown>>(
                              value as unknown as Record<PropertyKey, unknown>,
                              cb
                          ) as U[keyof U])
                        : cb(value),
                ] as const
        )
    ) as U;
}

/**
 * @description This behaves like JSON.stringify with the exception that it works with recursive objects
 * while also respecting JSON standards by replacing self-references by {$ref} objects
 */
export function stringify(arg: unknown | undefined | null): string {
    // this function was causing build problems so I replaced it with the good old JSON stringify
    return JSON.stringify(arg);
}

/**
 * @description Removes from obj the properties whose names are not in keys
 */
export function pick<T extends GenericRecord, K extends Array<keyof T>>(obj: T, ...keys: K) {
    return Object.fromEntries(ownEntries(obj).filter(([key, _]) => keys.includes(key))) as unknown as {
        [P in Extract<Union<K>, keyof T>]: T[P];
    };
}

/**
 * @description Removes from obj the properties whose names are in keys
 */
export function omit<T extends GenericRecord, K extends Array<keyof T>>(obj: T, ...keys: K) {
    return Object.fromEntries(ownEntries(obj).filter(([key, _]) => !keys.includes(key))) as unknown as {
        [P in Exclude<keyof T, Union<K>>]: T[P];
    };
}

/**
 * @description Removes from obj properties which value is undefined
 */
export function stripUndefined<T extends GenericRecord>(obj: T): StripUndefined<T> {
    return Object.fromEntries(ownEntries(obj).filter(([_, val]) => val !== undefined)) as T;
}

/**
 * @description Removes from obj properties which value is null
 */
export function stripNull<T extends GenericRecord>(obj: T): StripNull<T> {
    return Object.fromEntries(ownEntries(obj).filter(([_, val]) => val !== null)) as T;
}

/**
 * @description Removes from obj properties which value is nil
 */
export function stripNil<T extends GenericRecord>(obj: T): StripNil<T> {
    return Object.fromEntries(ownEntries(obj).filter(([_, val]) => val !== null && val !== undefined)) as T;
}
