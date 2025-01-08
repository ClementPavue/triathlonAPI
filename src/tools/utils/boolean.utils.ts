import { randomSelect } from "./data.utils";

export function randomBoolean(): boolean {
    return randomSelect(true, false);
}
