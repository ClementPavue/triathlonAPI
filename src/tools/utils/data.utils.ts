import { randomString } from "./string.utils";

export function randomEmailAddress(): string {
    return `${randomString(8, { numbers: false, uppers: false })}@${randomString(5, { numbers: false, uppers: false })}.com`;
}

export function randomSelect<T>(...dataset: Array<T>): T {
    return dataset[Math.round(Math.random() * (dataset.length - 1))];
}

export function randomId(): number {
    return Math.round(Math.random() * (2 ** 32 - 1));
}
