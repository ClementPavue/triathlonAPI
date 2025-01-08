import { HttpError } from "./http.error";

export class ForbiddenHttpError extends HttpError {
    static readonly code = 403;
    static readonly defaultMessage =
        "The request contained valid data and was understood by the server, but the server is refusing action.";
    static readonly defaultName = "Forbidden";
    constructor(
        message: string = ForbiddenHttpError.defaultMessage,
        name: string = ForbiddenHttpError.defaultName,
        stack?: string
    ) {
        super(ForbiddenHttpError.code, name, message, stack);
    }
}
