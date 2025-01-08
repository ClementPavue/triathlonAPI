type Deserializable = string | number | boolean | object | null;

/**
 * @description This represents the resulting structure of JSON.parse(JSON.stringify(T)),
 * which holds no functions, only basic objects, arrays and a subset of primitive values
 * (string, number, bigint, boolean, null)
 */
declare type Serialized<T> = T extends GenericFunction
    ? undefined
    : T extends { toJSON: GenericFunction }
      ? ReturnType<T["toJSON"]>
      : T extends [infer U, ...infer S]
        ? [U extends GenericFunction ? null : Serialized<U>, ...(S["length"] extends 0 ? [] : Serialized<S>)]
        : T extends Array<infer V>
          ? V extends GenericFunction
              ? [null]
              : Array<Serialized<V>>
          : T extends object
            ? { [P in keyof Grab<Strip<T, GenericFunction>, Deserializable>]: Serialized<T[P]> }
            : T extends Deserializable
              ? T
              : never;
