declare type GenericRecord<T = unknown> = { [P in keyof T]: T[P] };

declare type EmptyRecord = { [P in PropertyKey]: never };

declare type StrictMap<T extends GenericRecord> = {
    [P in keyof T]: T[P] extends undefined ? never : Exclude<T[P], undefined>;
};

declare type PartiallyUndefined<T> = {
    [P in keyof T]?: T[P] | undefined;
};

declare type RequiredExcept<T, K extends keyof T> = {
    [P in Extract<keyof T, K>]?: T[P];
} & {
    [P in Exclude<keyof T, K>]-?: T[P];
};

declare type PartialExcept<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]?: T[P];
} & {
    [P in Extract<keyof T, K>]-?: T[P];
};

/** @description From T, pick a set of properties which types are in K */
declare type Grab<T extends GenericRecord, U> = Pick<
    T,
    {
        [P in keyof T]: T[P] extends U ? P : never;
    }[keyof T]
>;

/** @description Construct a type with the properties of T except for those which type is in type K. */
declare type Strip<T extends GenericRecord, U> = Pick<
    T,
    {
        [P in keyof T]: T[P] extends U ? never : P;
    }[keyof T]
>;

/** @description Construct a type with the properties of T except for those which are undefined. */
declare type StripUndefined<T extends GenericRecord> = Pick<
    T,
    {
        [P in keyof T]: T[P] extends undefined ? never : P;
    }[keyof T]
>;

/** @description Construct a type with the properties of T except for those which are null. */
declare type StripNull<T extends GenericRecord> = Pick<
    T,
    {
        [P in keyof T]: T[P] extends null ? never : P;
    }[keyof T]
>;

/** @description Construct a type with the properties of T except for those which are null or undefined. */
declare type StripNil<T extends GenericRecord> = Pick<
    T,
    {
        [P in keyof T]: T[P] extends null | undefined ? never : P;
    }[keyof T]
>;

type OptionalPropertiesNames<T extends GenericRecord> = {
    [P in keyof T]-?: { [A in P]?: T[P] } extends { [A in P]: T[P] } ? P : never;
}[keyof T];

declare type GrabOptional<T extends GenericRecord> = Pick<T, OptionalPropertiesNames<T>>;
declare type StripRequired<T extends GenericRecord> = Omit<T, Exclude<keyof T, OptionalPropertiesNames<T>>>;
declare type GrabRequired<T extends GenericRecord> = Pick<T, Exclude<keyof T, OptionalPropertiesNames<T>>>;
declare type StripOptional<T extends GenericRecord> = Omit<T, OptionalPropertiesNames<T>>;
