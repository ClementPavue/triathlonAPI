import { HttpError } from "./http.error";

export class NotImplementedHttpError extends HttpError {
    static readonly code = 501;
    static readonly defaultMessage = "This endpoint is not ready for the beta version";
    static readonly defaultName = "Not Implemented";
    constructor(
        message: string = NotImplementedHttpError.defaultMessage,
        name: string = NotImplementedHttpError.defaultName,
        stack?: string
    ) {
        super(NotImplementedHttpError.code, name, message, stack);
    }
}
