import { isDate } from "util/types";

const invalidDateError = "Invalid Date" as const;
export function stringNumberOrDateToUNIXTimestamp(arg: Date | number | string): number {
    let parsedDate = isDate(arg) ? arg : (new Date(arg) as Date | typeof invalidDateError);
    if (parsedDate === invalidDateError || isNaN(parsedDate.valueOf())) {
        parsedDate = new Date(parseInt(arg as string, 10)) as Date | typeof invalidDateError;
        if (parsedDate === invalidDateError || isNaN(parsedDate.valueOf())) {
            throw new TypeError("Passed argument is neither a valid date nor date string nor timestamp");
        }
    }
    return Math.round(parsedDate.valueOf() / 1000);
}

export function getSmallestDate(): Date {
    return new Date(-53690);
}

export function getGreatestDate(): Date {
    return new Date(253402300799997);
}
