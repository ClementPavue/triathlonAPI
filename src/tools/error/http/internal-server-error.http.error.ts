import { HttpError } from "./http.error";

export class InternalServerErrorHttpError extends HttpError {
    static readonly code = 500;
    static readonly defaultMessage = "An unexpected condition was encountered.";
    static readonly defaultName = "Server Error";
    constructor(
        message: string = InternalServerErrorHttpError.defaultMessage,
        name: string = InternalServerErrorHttpError.defaultName,
        stack?: string
    ) {
        super(InternalServerErrorHttpError.code, name, message, stack);
    }
}
