import { RequestHandler, Router } from "express";

function sortPaths<T>(arr: Array<[path: string, data: T]>): typeof arr {
    return arr
        .map(([path, data]) => ({ path, segments: path.split("/").filter(el => el.length > 0), data }))
        .map(({ path, segments, data }) => ({
            path,
            orderMap: segments.map(segment => (segment.startsWith(":") ? "c" : "a")).join(""),
            data,
        }))
        .map(({ path, orderMap, data }, _, origin) => ({
            path,
            orderMap: orderMap.concat(
                Array.from(
                    {
                        length:
                            Math.max(...origin.map(({ orderMap: innerOrderMap }) => innerOrderMap.length)) - orderMap.length,
                    },
                    () => "b"
                ).join("")
            ),
            data,
        }))
        .sort(({ orderMap: lOrderMap }, { orderMap: rOrderMap }) =>
            lOrderMap > rOrderMap ? 1 : lOrderMap < rOrderMap ? -1 : 0
        )
        .map(({ path, data }) => [path, data]);
}

export function RouterFactory<
    T extends {
        [controllerName: string]: T[keyof T] extends RequestHandler<unknown, unknown, unknown, unknown, unknown>
            ? T[keyof T]
            : never;
    },
>(
    controllers: T,
    routes: {
        [key in keyof Omit<ReturnType<typeof Router>, "stack" | "route" | "param">]?: Array<[string, keyof T]>;
    }
): Router {
    const router = Router();
    Object.entries(routes).forEach(([method, methodRoutes]) => {
        sortPaths(methodRoutes).forEach(([path, controllerName]) => router[method](path, controllers[controllerName]));
    });
    return router;
}
