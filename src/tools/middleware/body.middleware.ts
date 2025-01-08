import express, { Handler, NextFunction, Request, Response } from "express";

export const createBodyParsingHandler: () => Handler = () => (req: Request, res: Response, next: NextFunction) => {
    const handlersMap: { [key: string]: ReturnType<typeof express.raw> } = {
        "application/json": express.json({ limit: "1mb" }),
        "text/html": express.text(),
        "text/plain": express.text(),
        "application/octet-stream": express.raw(),
    };
    const contentType = req.header("content-type");
    return !!contentType && typeof handlersMap[contentType] === "function" ? handlersMap[contentType]!(req, res, next) : next();
};
