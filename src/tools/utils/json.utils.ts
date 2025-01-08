import { errorLog } from "./log.utils";

export function safeParse(arg: string): unknown | undefined {
    try {
        return JSON.parse(arg);
    } catch (e) {
        errorLog(e, "JSON parse error");
        return undefined;
    }
}
