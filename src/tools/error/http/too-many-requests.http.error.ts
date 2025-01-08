import { HttpError } from "./http.error";

export class TooManyRequestsHttpError extends HttpError {
    static readonly code = 429;
    static readonly defaultMessage = "The user has sent too many requests in a given amount of time.";
    static readonly defaultName = "Too Many Requests";
    constructor(
        message: string = TooManyRequestsHttpError.defaultMessage,
        name: string = TooManyRequestsHttpError.defaultName,
        stack?: string
    ) {
        super(TooManyRequestsHttpError.code, name, message, stack);
    }
}
