import { randomSelect } from "./data.utils";

export function randomPositiveInteger(factor = 10): number {
    return Math.round(Math.random() * factor);
}

export function randomPositiveNumber(factor = 1000): number {
    return Math.round(Math.random() * factor);
}

export function randomNumber(factor = 1000): number {
    return randomPositiveNumber(factor) * randomSelect(1, -1);
}

export function randomNumberInRange(min: number = 0, max: number = 100): number {
    if (min > max) {
        throw new Error("Args make no sense");
    }
    if (min === max) {
        return min;
    }
    const delta = Math.abs(max - min);
    const sign = min < 0 && max < 0 ? -1 : min < 0 && max > 0 ? randomSelect(1, -1) : 1;
    return Math.max(min, Math.min(max, (randomPositiveNumber(delta) + min) * sign));
}
