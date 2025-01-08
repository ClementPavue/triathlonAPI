/* eslint-disable no-console */
import { Config } from "./config.utils";
import { stringify } from "./object.utils";
import moment from "moment";

function getWhitespace(length: number): string {
    return Array.from({ length }, () => " ").join("");
}

function getFormattedDate(): string {
    return moment().format("YYYY/MM/DD HH:mm:ss");
}

function getSourceLine(): string | undefined {
    return new Error().stack
        .split("\n")
        .slice(5)
        .map(str => str.trim().replace(/.*\(/, "").replace(/\).*/, "").split("/").pop())
        .filter((str, _, arr) => !str.includes(arr[0].split(":")[0]))[0];
}

function addSourceLine(arg: string, isError = false): string {
    const sourceLine = getSourceLine();
    if (sourceLine !== undefined && typeof sourceLine === "string") {
        const messages = arg.split("\n").filter(str => !!str);
        const consoleWidth = isError ? process.stderr.columns : process.stdout.columns;

        if (messages[0].length + 1 + sourceLine.length <= consoleWidth) {
            messages[0] += getWhitespace(consoleWidth - messages[0].length - sourceLine.length) + sourceLine;
        } else if (messages.at(-1).length + 1 + sourceLine.length <= consoleWidth) {
            messages[messages.length - 1] +=
                getWhitespace(consoleWidth - messages.at(-1).length - sourceLine.length) + sourceLine;
        } else {
            messages.push(`^ ${sourceLine}`);
        }

        return messages.join("\n");
    }
    return arg;
}

function formatLogOutput(arg: Primitive, details?: string) {
    return `[${getFormattedDate()}] > ${details ? details + ":\n  " : ""}${typeof arg === "string" ? arg : stringify(arg)}`;
}

function formatDebugOutput(arg: Primitive, details?: string) {
    return addSourceLine(
        `[${getFormattedDate()}] > ` + (details ? details + ":\n  " : "") + (typeof arg === "string" ? arg : stringify(arg))
    ).trim();
}

function formatErrorOutput(error: unknown, details?: string) {
    return addSourceLine(
        `${getFormattedDate()} > ` +
            (details ? details + ":\n  " : "") +
            (error instanceof Error ? (error.stack ?? `${error.name}: ${error.message}`) : stringify(error)),
        true
    ).trim();
}

export function log(arg: Primitive, details?: string): void {
    console.log(formatLogOutput(arg, details));
}

export function debugLog(arg: Primitive, details?: string): void {
    if (Config.get("debug")) {
        console.log(`\x1b[38;2;150;150;210m${formatDebugOutput(arg, details)}\x1b[0m`);
    }
}

export function errorLog(error: unknown, details?: string): void {
    console.error(`\x1b[38;2;255;100;100m${formatErrorOutput(error, details)}\x1b[0m`);
}
