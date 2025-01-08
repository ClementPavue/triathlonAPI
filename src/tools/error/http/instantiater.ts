import * as HttpErrorsClazzes from "./index";

export function InstantiateHttpError(
    code: (typeof HttpErrorsClazzes)[keyof typeof HttpErrorsClazzes]["code"],
    name?: string,
    message?: string,
    stack?: string
) {
    const httpErrorClazz = Object.values(HttpErrorsClazzes).find(clazz => clazz?.code === code);
    if (httpErrorClazz) {
        return new httpErrorClazz(message, name, stack);
    }
    throw new Error(`Failed to find an HttpError child for code '${code}'`);
}
