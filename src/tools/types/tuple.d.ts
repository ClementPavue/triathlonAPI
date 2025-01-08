declare type GenericTuple = [unknown, ...unknown[]];

declare type PartialTuple<T extends readonly unknown[]> = T extends [infer U, ...infer V]
    ? (V["length"] extends 0 ? [U] : [U, ...PartialTuple<V>] | [U]) | []
    : never;

declare type ReversePartialTuple<T extends readonly unknown[]> = T extends [...infer U, infer V]
    ? (U["length"] extends 0 ? [V] : [...ReversePartialTuple<U>, V] | [V]) | []
    : never;
