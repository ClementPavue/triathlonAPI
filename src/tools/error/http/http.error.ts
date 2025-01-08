export class HttpError extends Error {
    protected constructor(
        public readonly code: number = 500,
        public override readonly name: string = "HTTP Error",
        public override readonly message: string = "An error occured.",
        public override readonly stack?: string
    ) {
        super(message);
        const strCode = code.toString(10);
        if (strCode.length !== 3 || (!strCode.startsWith("4") && !strCode.startsWith("5"))) {
            throw new Error("Provided code is not a valid HTTP Error code");
        }
    }

    public toString() {
        return `HttpError ${this.code} '${this.name}': ${this.message}${this.stack ? "\n" + this.stack : ""}`;
    }

    public toJSON() {
        return Object.defineProperty(
            {
                error: this.name.toUpperCase().replace(/\s/g, "_"),
                message: this.message,
            },
            "stack",
            {
                value: this.stack,
                configurable: false,
                enumerable: false,
                writable: false,
            }
        );
    }
}
