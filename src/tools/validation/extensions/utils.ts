import { Context, isRef, Reference, State } from "@hapi/joi";
import { isNil } from "tools/utils/fp.utils";

function recursiveAccess<T>(obj: unknown, path: string[]): T {
    return (path.length === 1 ? obj[path[0]] : recursiveAccess(obj[path[0]], path.slice(1))) as T;
}

function refOrValueToValue<T>(arg: T | Reference, state: State, context: Context): T | undefined {
    return !isNil(arg)
        ? isRef(arg)
            ? recursiveAccess(arg.isContext ? context : state.parent, arg.path as unknown as string[])
            : arg
        : undefined;
}

export const JoiExtensionUtils = { refOrValueToValue };
