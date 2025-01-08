export function isReadableStream(arg: unknown): arg is NodeJS.ReadStream {
    return (
        typeof (arg as NodeJS.ReadableStream)?.readable === "boolean" &&
        typeof (arg as NodeJS.ReadableStream)?.read === "function"
    );
}

export function isWritableStream(arg: unknown): arg is NodeJS.WriteStream {
    return (
        typeof (arg as NodeJS.WritableStream)?.writable === "boolean" &&
        typeof (arg as NodeJS.WritableStream)?.write === "function"
    );
}

export function isReadWriteStream(arg: unknown): arg is NodeJS.ReadWriteStream {
    return isReadableStream(arg) && isWritableStream(arg);
}

export function isStream(arg: unknown): arg is NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream {
    return isReadableStream(arg) || isWritableStream(arg);
}
