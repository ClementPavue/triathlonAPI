/**
 * @author Scorechain
 * @description Default Javascript Object Constructor extension that behaves as if objects were strict and non extensibles
 * @extends {ObjectConstructor}
 */
declare interface ObjectConstructor {
    /**
     * @author Scorechain
     * @description Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
     * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
     * @param o Object that contains the own properties.
     */
    getOwnPropertyNames<T extends GenericRecord>(o: T): Array<Exclude<keyof T, symbol>>;

    /**
     * @author Scorechain
     * @description Returns an array of all symbol properties found directly on object o.
     * @param o — Object to retrieve the symbols from.
     */
    getOwnPropertySymbols<T extends GenericRecord>(o: T): Array<Extract<keyof T, symbol>>;

    /**
     * @author Scorechain
     * @description Returns the names of the enumerable string properties and methods of an object.
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    keys<T extends GenericRecord & { prototype: GenericRecord | never }>(
        o: T
    ): Array<Exclude<keyof T, symbol> | Exclude<keyof T["prototype"], symbol>>;

    /**
     * @author Scorechain
     * Returns an array of values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    values<T extends GenericRecord>(o: T): Array<T[keyof T]>;

    /**
     * @author Scorechain
     * @description Returns an array of key/values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    entries<T extends GenericRecord>(o: T): Array<{ [P in keyof T]-?: readonly [P, T[P]] }[keyof T]>;

    /**
     * @author Scorechain
     * @description Returns an object created by key-value entries for properties and methods
     * @param entries An iterable object that contains key-value entries for properties and methods.
     */
    fromEntries<T extends ArrayLike<readonly [PropertyKey, unknown]>>(entries: T): { [P in T[number][0]]: T[number][1] };

    /**
     * @author Scorechain
     * @description Determines whether an object has a property with the specified name.
     * @param o An object.
     * @param v A property name.
     */
    hasOwn<T extends GenericRecord>(o: T, v: keyof T): boolean;

    /**
     * @author Scorechain
     * @description Copy the values of all of the enumerable own properties from one or more source objects to a target object. Returns the target object.
     * @param target The target object to copy to.
     * @param sources One or more source objects from which to copy properties
     */
    assign<T extends GenericRecord, U extends GenericRecord>(target: T, ...sources: U[]): T & U;
}
