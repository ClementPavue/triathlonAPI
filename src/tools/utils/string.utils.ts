export function randomString(
    length: number = 32,
    flags: Partial<{
        specials: boolean;
        punctuation: boolean;
        spaces: boolean;
        numbers: boolean;
        lowers: boolean;
        uppers: boolean;
        numbersSet: string;
        lowersSet: string;
        uppersSet: string;
        punctuationSet: string;
        specialsSet: string;
    }> = {}
): string {
    flags = {
        numbers: true,
        lowers: true,
        uppers: true,
        ...flags,
    };
    if (Object.getOwnPropertyNames(flags).length === 0 || length <= 0) {
        throw new Error("WTF?");
    }
    const chars =
        (flags.punctuation ? flags.punctuationSet || "'!,.;:?" : "") +
        (flags.specials ? flags.specialsSet || '-"#$%&()*+/<=>@[\\]^_`{|}~' : "") +
        (flags.spaces ? " " : "") +
        (flags.numbers ? flags.numbersSet || "0123456789" : "") +
        (flags.lowers ? flags.lowersSet || "abcdefghijklmnopqrstuvwxyz" : "") +
        (flags.uppers ? flags.uppersSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "");
    return Array.from({ length }, () => chars[Math.round(Math.random() * (chars.length - 1))]!).join("");
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
