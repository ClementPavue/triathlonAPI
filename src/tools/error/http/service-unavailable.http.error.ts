import { HttpError } from "./http.error";

export class ServiceUnavailableHttpError extends HttpError {
    static readonly code = 503;
    static readonly defaultMessage = "The server cannot handle the request";
    static readonly defaultName = "Service Unavailable";
    constructor(
        message: string = ServiceUnavailableHttpError.defaultMessage,
        name: string = ServiceUnavailableHttpError.defaultName,
        stack?: string
    ) {
        super(ServiceUnavailableHttpError.code, name, message, stack);
    }
}
