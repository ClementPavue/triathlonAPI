// TODO Fix the following dependencies in order to use this beauty
//
//  node_modules/binancesmartchain-adapter/src/modules/connector/Connector.ts:352
//  node_modules/ethereum-adapter/src/modules/connector/Connector.ts:14
//  node_modules/tezos-adapter/src/modules/connector/Connector.ts:124
//  node_modules/tron-adapter/src/modules/connector/Connector.ts:214
//
// /**
//  * @author Scorechain
//  * @description Default javascript function interface override for generic typing purposes
//  * @extends {Function}
//  */
// declare interface Function {
//     /**
//      * For a given function, creates a bound function that has the same body as the original function.
//      * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
//      * @author Scorechain
//      * @param thisArg An object to which the this keyword can refer inside the new function.
//      * @param argArray A list of arguments to be passed to the new function.
//      */
//     bind<T extends GenericFunction, U extends PartialTuple<Parameters<T>>, V extends ReturnType<T>>(
//         this: T,
//         ...args: [thisArg?: ThisParameterType<T>, ...argArray: U]
//     ): T extends (...innerArgs: infer W) => V
//         ? W["length"] extends 0
//             ? () => V
//             : W extends [...U, ...infer X]
//             ? X["length"] extends 0
//                 ? () => V
//                 : (...innerArgs: X) => V
//             : never
//         : never;
// }
