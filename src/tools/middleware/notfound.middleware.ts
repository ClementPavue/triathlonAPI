import { NextFunction, Request, RequestHandler, Response } from "express";
import { NotFoundHttpError } from "tools/error/http/not-found.http.error";

export const createNotFoundHandler: () => RequestHandler = () => (request: Request, response: Response, _: NextFunction) => {
    if (response.headersSent) {
        return;
    }

    const error = new NotFoundHttpError();
    if (!response.headersSent) {
        response.status(error.code).send(error);
    }
};
