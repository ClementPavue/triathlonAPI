/* eslint-disable max-depth */
import type Joi from "@hapi/joi";
import "joi-extract-type";
import { Val } from "tools/validation";
import { Request, Response } from "express";
import { HttpError } from "tools/error/http/http.error";
import { NotFoundHttpError } from "tools/error/http/not-found.http.error";
import { unary } from "tools/utils/fp.utils";
import { isReadableStream } from "tools/utils/nodejs.utils";
import { pick } from "tools/utils/object.utils";
import { Config } from "tools/utils/config.utils";
import { getAuthorizations } from "tools/authorization/authorization";
import { AuthenticationCredentials } from "tools/authentication/authentication";
import { InstantiateHttpError } from "../error/http/instantiater";

export type ParsableQs = {
    [key: string]:
        | undefined
        | Date
        | Date[]
        | Exclude<Primitive, object | null>
        | Exclude<Primitive, object | null>[]
        | ParsableQs
        | ParsableQs[];
};

export type RequestParams = Request["params"] | ParsableQs;
export type RequestQuery = Request["query"] | ParsableQs;
export type RequestBody = Request["body"];

const checkRequestValidity = <
    A extends boolean,
    B extends boolean,
    C extends boolean,
    D extends Request<T, unknown, V, U>,
    T extends RequestParams,
    U extends RequestQuery,
    V extends Request["body"],
    W extends
        | (
              | Joi.BoxAlternativesSchema<Joi.Box<V, boolean>>
              | Joi.BoxArraySchema<Joi.Box<Joi.BoxObjectSchema<Joi.Box<V, boolean>>, C>>
              | Joi.BoxObjectSchema<Joi.Box<V, C>>
          )
        | undefined,
>(
    validatorsSchemas: {
        params?: Joi.BoxObjectSchema<Joi.Box<T, A>> | undefined;
        query?: Joi.BoxObjectSchema<Joi.Box<U, B>> | undefined;
        body?: W;
    },
    request: D,
    context?: ValidatorsContext<PropertyKey>
) =>
    Object.entries(
        Object.assign(
            {
                params: Val.object({}),
                query: Val.object({}),
                body: Val.object({}),
            } as typeof validatorsSchemas,
            validatorsSchemas
        )
    )
        .map(([key, value]) => [key, value?.isJoi ? value.label(key) : value] as const)
        .reduce(
            (acc, [key, validatorSchema]) => {
                acc[key] = Val.compile(validatorSchema).validate(request[key], {
                    abortEarly: !!context?.alternativeDiscriminantKey,
                    context,
                }) as typeof key extends "params"
                    ? Joi.ValidationResult<T>
                    : typeof key extends "query"
                      ? Joi.ValidationResult<U>
                      : typeof key extends "body"
                        ? Joi.ValidationResult<V>
                        : never;
                return acc;
            },
            {} as {
                [K in keyof typeof validatorsSchemas]: Joi.ValidationResult<Joi.extractType<(typeof validatorsSchemas)[K]>>;
            }
        );

const createBadRequestErrorFromValidityCheckResult = (
    valuesAndErrors: Record<string, Joi.ValidationResult<unknown>>,
    context: ValidatorsContext<PropertyKey>
) => {
    let errorCode = 400;
    const errorContent = Object.values(valuesAndErrors).reduce(
        (str: string, { error }: { error: Joi.ValidationError | Error }) => {
            if (error) {
                str += str ? str + ", " : "";
                if ((error as Joi.ValidationError).isJoi) {
                    const joiError = error as Omit<Joi.ValidationError, "details"> & {
                        details: Array<Joi.ValidationError["details"][number] & { context?: { errorCode?: number } }>;
                    };
                    errorCode =
                        [...joiError.details].reverse().find(detail => typeof detail?.context?.errorCode === "number")?.context
                            ?.errorCode ?? errorCode;

                    if (context?.alternativeDiscriminantKey) {
                        if (
                            joiError.details.every(
                                detail =>
                                    detail.context.key === context.alternativeDiscriminantKey &&
                                    !detail.message.includes("is not allowed to be empty") &&
                                    !detail.message.includes("is required") &&
                                    !detail.message.includes("length must be")
                            )
                        ) {
                            str += `'${String(context.alternativeDiscriminantKey)}' must be one of [${joiError.details
                                .reduce(
                                    (substr, detail) => substr + (detail.context as { valids: [string] })["valids"][0] + ", ",
                                    ""
                                )
                                .slice(0, -2)}]`;
                        } else if (
                            joiError.details.every(detail => detail.context.key === context.alternativeDiscriminantKey)
                        ) {
                            str += joiError.details[0].message.replace(/"/g, "'");
                        } else {
                            str += joiError.details
                                .filter(detail => detail.context.key !== context.alternativeDiscriminantKey)
                                .map(detail => detail.message.replace(/"/g, "'"))
                                .join(", ");
                        }
                    } else {
                        str += joiError.details.map(detail => detail.message.replace(/"/g, "'")).join(", ");
                    }
                } else {
                    str += (error as Error).message;
                }
            }
            return str;
        },
        ""
    );

    const errorLabel = Object.values(valuesAndErrors)
        .map(({ error }) => error)
        .filter(error => !!error && error.isJoi)
        .map(({ details }) => details)
        .flat()
        .filter(detail => !!detail)
        .map(({ message }) => message)
        .some(message => message.includes("is required"))
        ? "Missing Parameter"
        : "Invalid Parameter";

    const errorStack = Object.values(valuesAndErrors)
        .map(({ error }) => error)
        .filter(error => !!error && error.isJoi)
        .reduce((acc, error) => (error.stack ? acc + error.name + " : " + error.stack + "\n" : acc), "");

    return InstantiateHttpError(errorCode as Parameters<typeof InstantiateHttpError>[0], errorLabel, errorContent, errorStack);
};

const createResponseStatusCode = (data: unknown, params?: { forbidEmptyResponse?: boolean }) => {
    return !!params?.forbidEmptyResponse &&
        (data === null ||
            data === undefined ||
            (Array.isArray(data) && data.length === 0) ||
            (data !== null && typeof data === "object" && Object.getOwnPropertyNames(data)?.length === 0) ||
            (typeof data === "string" && data === ""))
        ? 404
        : data === null || data === undefined
          ? 204
          : 200;
};

export interface Controller<
    T extends Request<unknown, unknown, unknown, unknown>,
    U extends Response<unknown>,
    V extends PartiallyUndefined<Record<"params" | "body" | "query", Joi.Schema>>,
> {
    (request: T, response: U, next: (err?: unknown) => void): void;
    validators: V;
}

export interface ValidatorsContext<K extends PropertyKey> {
    alternativeDiscriminantKey?: K;
}

export const ControllerFactory = <
    A extends boolean,
    B extends boolean,
    C extends boolean,
    T extends Conditional<A, RequestParams>,
    U extends Conditional<B, RequestQuery>,
    V extends Conditional<C, RequestBody>,
    W extends V extends Joi.BoxAlternativesSchema<Joi.Box<V, boolean>>
        ? Joi.BoxAlternativesSchema<Joi.Box<V, boolean>>
        : V extends Joi.BoxArraySchema<Joi.Box<Joi.BoxObjectSchema<Joi.Box<V, boolean>>, C>>
          ? Joi.BoxArraySchema<Joi.Box<Joi.BoxObjectSchema<Joi.Box<V, boolean>>, C>>
          : Joi.BoxObjectSchema<Joi.Box<V, C>>,
>(
    args: {
        params?: Joi.BoxObjectSchema<Joi.Box<T, A>> | undefined;
        query?: Joi.BoxObjectSchema<Joi.Box<U, B>> | undefined;
        body?: W | undefined;
        context?: ValidatorsContext<keyof Joi.extractType<W>>;
        forbidEmptyResponse?: boolean;
        isDebugOnly?: boolean;
    },
    handler: (input: {
        params: WhenNotUndefined<typeof args.params, Joi.extractType<typeof args.params>>;
        query: WhenNotUndefined<typeof args.query, Joi.extractType<typeof args.query>>;
        body: WhenNotUndefined<typeof args.body, Joi.extractType<typeof args.body>>;
        user: AuthenticationCredentials;
        headers: Request["headers"];
    }) => Promise<NodeJS.ReadableStream | Primitive | void>,
    options?: {
        streamResponseErrorHandler?: (e: Error) => HttpError;
    }
): Controller<
    Request<
        Parameters<typeof handler>[0]["params"],
        ReturnTypeAsync<typeof handler>,
        Parameters<typeof handler>[0]["body"],
        Parameters<typeof handler>[0]["query"]
    >,
    Response<ReturnTypeAsync<typeof handler>>,
    Pick<typeof args, "params" | "body" | "query">
> =>
    Object.assign(
        !args.isDebugOnly || Config.get("debug")
            ? (
                  request: Request<
                      Parameters<typeof handler>[0]["params"],
                      ReturnTypeAsync<typeof handler>,
                      Parameters<typeof handler>[0]["body"],
                      Parameters<typeof handler>[0]["query"],
                      Record<string, unknown>
                  >,
                  response: Response<ReturnTypeAsync<typeof handler>>,
                  next: (err?: unknown) => void
              ) => {
                  getAuthorizations<typeof request>(request)
                      .then(authorizations => {
                          const valuesAndErrors = checkRequestValidity<A, B, C, typeof request, T, U, V, W>(
                              pick(args, "query", "body", "params"),
                              request,
                              args.context
                          );
                          if (Object.values(valuesAndErrors).some(({ error }) => !!error)) {
                              return Promise.reject(
                                  createBadRequestErrorFromValidityCheckResult(valuesAndErrors, args.context)
                              );
                          }
                          return handler({
                              params: valuesAndErrors["params"]?.value,
                              query: valuesAndErrors["query"]?.value,
                              body: valuesAndErrors["body"]?.value,
                              headers: request.headers,
                              user: authorizations,
                          });
                      })
                      .then(data => {
                          const statusCode = createResponseStatusCode(data, args);
                          if (statusCode === 404) {
                              return Promise.reject(new NotFoundHttpError());
                          }
                          const sendResponse = () =>
                              new Promise<void>((res, rej) => {
                                  if (isReadableStream(data)) {
                                      response.setHeader("Content-Disposition", "attachment");
                                      data.on("error", e => {
                                          if (options?.streamResponseErrorHandler) {
                                              rej(options.streamResponseErrorHandler(e));
                                          } else {
                                              rej(e);
                                          }
                                      });
                                      response.on("error", rej).on("close", res);
                                      data.pipe(response);
                                  } else {
                                      response.status(statusCode).send(data).on("close", res).on("error", rej);
                                  }
                              });

                          return sendResponse();
                      })
                      .catch(unary(next));
              }
            : (_, __, next: (err?: unknown) => void) => next(new NotFoundHttpError()),
        { validators: pick(args, "params", "query", "body") }
    );
