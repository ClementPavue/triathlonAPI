import { randomSelect } from "./data.utils";
import { randomNumberInRange } from "./number.utils";
import { randomString } from "./string.utils";

export function randomBitcoinAddress() {
    return "bc1q" + randomString(randomNumberInRange(37, 59));
}

export function randomEthereumAddress() {
    return "0x" + randomString(40, { lowersSet: "abcdef", uppersSet: "ABCDEF" });
}

export function randomBitcoinCashAddress() {
    return randomSelect("p", "q") + randomString(41, { uppers: false });
}

export function randomLitecoinAddress() {
    return "ltc1" + randomString(39);
}
