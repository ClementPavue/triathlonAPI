import { Stream } from "stream";

export const jsonObjectToCsvStream = (items: object[]): NodeJS.ReadableStream => {
    const csvStream = new Stream.Readable();
    const replacer = (key, value: string | number | undefined) => (value === null ? "" : value);
    if (items && items.length) {
        const header = Object.keys(items[0]);
        const csvString = [
            header.join(","), // header row first
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(",")),
        ].join("\r\n");
        csvStream.push(csvString);
    } else {
        csvStream.push("Empty result");
    }
    csvStream.push(null);
    return csvStream;
};
