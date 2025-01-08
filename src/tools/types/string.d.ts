/**
 * @author Scorechain
 * @description Default Javascript String extension
 * @extends {String}
 */
declare interface String {
    /**
     * @author Scorechain
     * Returns a lowercased string
     */
    toLowerCase<T extends string>(this: T): Lowercase<T>;

    /**
     * @author Scorechain
     * Returns an uppercased string
     */
    toUpperCase<T extends string>(this: T): Uppercase<T>;
}
