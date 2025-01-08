import { randomUUID } from "crypto";
import { debugLog, errorLog } from "./log.utils";

export const timeout = <T = void>(duration: number, context?: T) => {
    return new Promise<T>(res => setTimeout(() => res(context), duration));
};

export const badTimeout = (duration: number, error?: Error | string) => {
    return new Promise<never>((_, rej) => setTimeout(() => rej(error), duration));
};

export const retryUntilSuccess = <T>(
    promiseFactory: () => Promise<T>,
    timeoutUntilRetryDuration: number = 10000,
    timeoutUntilAbortDuration: number = 100000,
    uniqueId = randomUUID().slice(0, 8)
): Promise<T> => {
    let retryOccurence = 0;
    const recursiveCatcher = <U>(innerPromiseFactory: () => Promise<U>): Promise<U> =>
        Promise.race([
            badTimeout(timeoutUntilAbortDuration, new Error("Service took too long to answer")),
            innerPromiseFactory(),
        ]).catch((error: Error | string) => {
            errorLog(
                error,
                `Caught error in retryUntilSuccess "${uniqueId}" (occurence ${retryOccurence}), retrying in ${timeoutUntilRetryDuration}ms`
            );
            ++retryOccurence;
            return timeout(timeoutUntilRetryDuration).then(() => {
                debugLog(`Retrying retryUntilSuccess "${uniqueId}"`);
                return recursiveCatcher(innerPromiseFactory);
            });
        });
    return recursiveCatcher(promiseFactory);
};

interface FaultlessPromise<T> {
    /**
     * Attach callback for the resolution of the FaultlessPromise.
     * @param onfulfilled The callback to execute when the FaultlessPromise is resolved.
     * @returns A FaultlessPromise for the completion of which ever callback is executed.
     */
    then<TResult1 = T | null>(
        onfulfilled?: ((value: T | null) => TResult1 | PromiseLike<TResult1>) | undefined | null
    ): Promise<TResult1>;

    toPromise: (this: FaultlessPromise<T>) => Promise<T>;
}

/**
 * @description Turns a promise into a securePromised promise which is basically the same except that errors are caught silently and optionnally logged
 */
export const securePromise = <T>(promise: Promise<T>, logError = false, returnValue: T | null = null): FaultlessPromise<T> =>
    Object.assign(
        promise.catch(error => {
            if (logError) {
                errorLog(error);
            }
            return Promise.resolve(returnValue);
        }),
        {
            toPromise: function (this: FaultlessPromise<T>) {
                return promise;
            },
        }
    );
