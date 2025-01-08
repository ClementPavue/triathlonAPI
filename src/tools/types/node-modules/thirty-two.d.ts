declare module "thirty-two" {
    export function encode(arg: string): Buffer;
    export function decode(arg: Buffer): string;
}
