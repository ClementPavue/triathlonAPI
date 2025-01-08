import { HttpError } from "./http.error";

export class ConflictHttpError extends HttpError {
    static readonly code = 409;
    static readonly defaultMessage =
        "The request could not be processed because of conflict in the current state of the resource.";
    static readonly defaultName = "Conflict";
    constructor(
        message: string = ConflictHttpError.defaultMessage,
        name: string = ConflictHttpError.defaultName,
        stack?: string
    ) {
        super(ConflictHttpError.code, name, message, stack);
    }
}
