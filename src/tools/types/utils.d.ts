declare type Primitive = string | number | bigint | boolean | symbol | undefined | object | null;
declare type TypeOfValues = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

declare type Nullable<T> = T extends null | undefined ? T : never;
declare type Full<T> = Exclude<T, undefined>;
declare type WhenNotUndefined<T, U = T, V = U | undefined | never> = T extends undefined ? V : U;
declare type Conditional<T, U = T, V = U | undefined | never> = T extends falsy ? V : U;

/** @description Allows to view a 'T' discriminated union when its type at index 'DiscriminantKey' is of 'DiscriminantValue' type */
declare type Constrained<
    T extends GenericRecord,
    DiscriminantKey extends keyof T,
    DiscriminantValue extends T[DiscriminantKey],
> = T extends { [P in DiscriminantKey]: DiscriminantValue } ? T : never;

/** @description Allows to genericly view a 'T' discriminated union when its type at index 'DiscriminantKey' is of 'DiscriminantValue' type */
declare type GenericlyConstrained<
    T extends GenericRecord,
    DiscriminantKey extends keyof T,
    DiscriminantValue extends T[DiscriminantKey],
> = T[DiscriminantKey] extends DiscriminantValue ? T : never;

/** @description Allows to view a 'T' discriminated union when its type at index 'DiscriminantKey' is all but 'DiscriminantValue' type */
declare type NotConstrained<
    T extends GenericRecord,
    DiscriminantKey extends keyof T,
    DiscriminantValue extends T[DiscriminantKey],
> = T extends { [P in DiscriminantKey]: Exclude<T[DiscriminantKey], DiscriminantValue> } ? T : never;

declare type GenericlyNotConstrained<
    T extends GenericRecord,
    DiscriminantKey extends keyof T,
    DiscriminantValue extends T[DiscriminantKey],
> = T[DiscriminantKey] extends DiscriminantValue ? never : T;

/**
 * @description Turns a tuple into a union
 * @example ['a', 'b', 'c'] => 'a' | 'b' | 'c'
 */
declare type Union<T> = T extends readonly [infer U, ...infer V] ? (V["length"] extends 0 ? U : U | Union<V>) : never;

/**
 * @description Turns a tuple into an intersection
 * @example ['a', 'b', 'c'] => 'a' & 'b' & 'c'
 */
declare type Intersection<T> = T extends readonly [infer U, ...infer V]
    ? V["length"] extends 0
        ? U
        : U & Intersection<V>
    : never;

declare type Optional<T, K extends keyof T> = Omit<T, K> & {
    [P in K]?: T[P] | undefined;
};
