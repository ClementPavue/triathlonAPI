declare type GenericFunction = (...args: unknown[]) => unknown;

declare type ReturnTypeAsync<T extends (...args: unknown[]) => Promise<unknown>> = T extends (
    ...args: unknown[]
) => Promise<infer R>
    ? R
    : never;
