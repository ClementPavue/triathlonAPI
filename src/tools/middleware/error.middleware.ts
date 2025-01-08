import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { InstantiateHttpError } from "tools/error/http/instantiater";
import { BadRequestHttpError } from "tools/error/http/bad-request.http.error";
import { ConflictHttpError } from "tools/error/http/conflict.http.error";
import { HttpError } from "tools/error/http/http.error";
import { InternalServerErrorHttpError } from "tools/error/http/internal-server-error.http.error";
import { NotFoundHttpError } from "tools/error/http/not-found.http.error";
import { GenericErrorMessages } from "tools/error/messages/generic";
import { safeParse } from "tools/utils/json.utils";
import { errorLog } from "tools/utils/log.utils";

export const createErrorHandler: () => ErrorRequestHandler =
    (): ErrorRequestHandler =>
    (rawError: HttpError | Error | string | unknown, _: Request, response: Response, __: NextFunction) => {
        if (response.headersSent) {
            return;
        }
        let error: HttpError;
        if (rawError instanceof HttpError) {
            error = rawError;
        } else if (rawError instanceof Error) {
            switch (rawError.name.toUpperCase()) {
                case "SYNTAXERROR": {
                    error = new BadRequestHttpError(GenericErrorMessages.INVALID_JSON, "INVALID_JSON", rawError.stack);
                    break;
                }
                case "PAYLOADTOOLARGEERROR": {
                    error = new BadRequestHttpError(
                        GenericErrorMessages.PAYLOAD_TOO_LARGE,
                        "PAYLOAD_TOO_LARGE",
                        rawError.stack
                    );
                    break;
                }
                case "HTTPERROR": {
                    const body = safeParse(((rawError as unknown)?.["response"] as unknown)?.["body"] as string) as {
                        error?: {
                            status: number;
                            type: string;
                            message: string;
                            stack?: string;
                        };
                    };
                    error = body?.error
                        ? InstantiateHttpError(
                              body.error.status as Parameters<typeof InstantiateHttpError>[0],
                              body.error.type,
                              body.error.message,
                              body.error.stack ?? rawError.stack
                          )
                        : new InternalServerErrorHttpError(rawError.message, rawError.name, rawError.stack);
                    break;
                }
                default: {
                    error = new InternalServerErrorHttpError(
                        GenericErrorMessages.SERVER_ERROR,
                        InternalServerErrorHttpError.defaultName,
                        rawError?.stack
                    );
                    break;
                }
            }
        } else if (typeof rawError === "string") {
            switch (rawError) {
                case "DUPLICATE":
                case "CONFLICT":
                    error = new ConflictHttpError(GenericErrorMessages.RESOURCE_EXISTS);
                    break;
                case "FOREIGN_KEY":
                case "NOT_FOUND":
                    error = new NotFoundHttpError(GenericErrorMessages.RESOURCE_UNFOUND);
                    break;
                default:
                    error = new InternalServerErrorHttpError(GenericErrorMessages.SERVER_ERROR + "\n" + rawError);
                    break;
            }
        } else {
            error = new InternalServerErrorHttpError(GenericErrorMessages.SERVER_ERROR);
        }
        errorLog(error);
        response.status(error.code).send(error);
    };
