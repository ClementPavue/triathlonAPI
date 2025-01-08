import { AuthenticationCredentials, getAuthenticationCredentials } from "tools/authentication/authentication";
import { Request } from "express";
export type Authorizations = AuthenticationCredentials;

export async function getAuthorizations<T extends Request<unknown, unknown, unknown, unknown, unknown>>(
    request: T
    //_: AuthorizationSpecifications
): Promise<Authorizations> {
    const authenticationCredentials = await getAuthenticationCredentials(request);
    const authorizations: Authorizations = {
        ...authenticationCredentials,
    };
    filterAccess(request as Request, authorizations);
    return authorizations;
}

/**
 * Exported for testing purposes
 * @param request
 * @param authorizations
 */
export function filterAccess(_: Request, __: Authorizations) {
    return;
}
