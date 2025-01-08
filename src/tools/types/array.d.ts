declare type GenericArray = Array<unknown>;
declare type ArrayValue<T> = T extends Iterable<infer U> | ArrayLike<infer U> ? U : never;
