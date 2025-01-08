export const isFalsy = <T>(arg: T): boolean => !arg;
export const isTruthy = <T>(arg: T): boolean => !!arg;

export const throwError = (error?: Error) => {
    throw error ?? new Error("Undesirable issue");
};

export const nullary =
    <T, U>(f: (...args: T[]) => U): (() => U) =>
    () =>
        f();

export const unary =
    <T extends Array<unknown>, U>(f: (...args: [...T]) => U): ((arg: T[0]) => U) =>
    (arg: T[0]) =>
        (f as unknown as (innerArg: T[0]) => U)(arg);

export const rejector = ((...args: [Error | string, ...unknown[]]) => {
    switch (args.length) {
        case 1:
            return () => Promise.reject(args[0]);
        case 0:
            return (arg: unknown) => Promise.reject(arg);
        default:
            throw new Error("instanceOf called with invalid number of arguments");
    }
}) as (() => (error: Error | string) => Promise<never>) & ((error: Error | string) => () => Promise<never>);

export const resolver = ((...args: unknown[]) => {
    switch (args.length) {
        case 1:
            return () => Promise.resolve(args[0]);
        case 0:
            return (arg: unknown) => Promise.resolve(arg);
        default:
            throw new Error("instanceOf called with invalid number of arguments");
    }
}) as (() => (error: Error | string) => Promise<never>) & ((error: Error | string) => () => Promise<never>);

export const nothing = (): undefined => undefined;

export const empty = (): void => undefined;

export const instanceOf = ((...args: [GenericClass, ...unknown[]]) => {
    switch (args.length) {
        case 2:
            return args[1] instanceof args[0];
        case 1:
            return (innerArg: unknown) => innerArg instanceof args[0];
        default:
            throw new Error("instanceOf called with invalid number of arguments");
    }
}) as (<C extends GenericClass, I extends ClassInstance<C>>(clazz: C, arg: unknown) => arg is I) &
    (<C extends GenericClass, I extends ClassInstance<C>>(clazz: C) => (arg: unknown) => arg is I);

export const isNil = (arg: unknown): arg is null | undefined => {
    return arg === null || arg === undefined;
};
