import { Request } from "express";

type AdminPermissions = {
    superAdmin: boolean;
    licensing: boolean;
    logs: boolean;
    data: boolean;
};
export interface AuthenticationCredentials {
    userId: number;
    groupId: number;
    permissions: AdminPermissions;
}

export async function getAuthenticationCredentials<T extends Request<unknown, unknown, unknown, unknown, unknown>>(
    _: T
): Promise<AuthenticationCredentials> {
    return Promise.resolve({
        userId: undefined,
        groupId: undefined,
        permissions: undefined,
    });
}
