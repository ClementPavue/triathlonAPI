import { stringNumberOrDateToUNIXTimestamp } from "tools/utils/dates.utils";

describe("Dates utils", () => {
    describe("stringNumberOrDateToUNIXTimestamp", () => {
        const testDate = new Date("26 October 1985 01:20 PDT");
        const expectedValue = Math.round(testDate.valueOf() / 1000);

        it("should handle Date as Date", () => {
            const unixTimestamp = stringNumberOrDateToUNIXTimestamp(testDate);
            expect(unixTimestamp).toBe(expectedValue);
        });

        it("should handle Date as string", () => {
            const unixTimestamp = stringNumberOrDateToUNIXTimestamp(testDate.toString());
            expect(unixTimestamp).toBe(expectedValue);
        });

        it("should handle Date as isostring", () => {
            const unixTimestamp = stringNumberOrDateToUNIXTimestamp(testDate.toISOString());
            expect(unixTimestamp).toBe(expectedValue);
        });

        it("should handle timestamp as number", () => {
            const numberTimestamp = testDate.valueOf();

            const unixTimestamp = stringNumberOrDateToUNIXTimestamp(numberTimestamp);
            expect(unixTimestamp).toBe(expectedValue);
        });

        it("should handle timestamp as string", () => {
            const stringTimestamp = testDate.valueOf().toString();

            const unixTimestamp = stringNumberOrDateToUNIXTimestamp(stringTimestamp);
            expect(unixTimestamp).toBe(expectedValue);
        });
    });
});
